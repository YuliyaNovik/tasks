const http = require("http");
const { existsSync, statSync, readFile } = require("fs");
const url = require("url");
const path = require("path");

class Server {
    constructor(port, hostName) {
        this.routes = [];
        this.clients = [];

        this._server = http.createServer(async (request, response) => {
            const route = this.routes.find(
                (route) =>
                    this._compareURL(route.url, request.url) &&
                    route.method === request.method
            );

            if (route) {
                route.callback(request, response);
                return;
            }

            const staticPath = "./static";

            const uri = url.parse(request.url).pathname;
            let filename = path.join(process.cwd(), staticPath, uri);

            if (!existsSync(filename)) {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.write("404 Not Found\n");
                response.end();
                return;
            }

            if (statSync(filename).isDirectory()) {
                filename = path.join(filename, "/index.html");
            }

            readFile(filename, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, { "Content-Type": "text/plain" });
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                response.writeHead(200);
                response.write(file, "binary");
                response.end();
            });
        });

        this._server.on("clientError", function onClientError(err, socket) {
            console.log("clientError", err);
            socket.end("400 Bad Request\r\n\r\n");
        });

        this._server.listen(port, hostName, function () {
            console.log("Server is online");
        });
    }

    sendEventToAll(newFile) {
        this.clients.forEach((client) =>
            client.response.write(`data: ${JSON.stringify(newFile)}\n\n`)
        );
    }

    get(url, callback) {
        this._route("GET", url, callback);
    }

    post(url, callback) {
        this._route("POST", url, callback);
    }

    _route(method, url, callback) {
        this.routes.push({
            url,
            callback,
            method,
        });
    }

    _compareURL(routeURL, requestURL) {
        if (routeURL.test) {
            return routeURL.test(requestURL);
        }

        return routeURL === requestURL;
    }
}

module.exports = { Server };
