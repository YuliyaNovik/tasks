const http = require("http");
const { getHtmlPage } = require("./utils/htmlPage");

class Server {
    constructor(port, hostName) {
        this.routers = [];
        this.clients = [];

        this._server = http.createServer(async (request, response) => {
            const route = this.routers
                .map((router) => router.routes)
                .flat()
                .find((route) => this._compareURL(route.url, request.url) && route.method === request.method);

            if (route) {
                route.callback(request, response);
                return;
            }

            try {
                const htmlPage = await getHtmlPage(request);
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end(htmlPage);
            } catch (error) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(error + "\n");
                response.end();
                return;
            }
        });

        this._server.on("clientError", function onClientError(err, socket) {
            console.log("clientError", err);
            socket.end("400 Bad Request\r\n\r\n");
        });

        this._server.listen(port, hostName, function () {
            console.log("Server is online");
        });
    }

    addRouter(router) {
        this.routers.push(router);
    }

    _compareURL(routeURL, requestURL) {
        if (routeURL.test) {
            return routeURL.test(requestURL);
        }

        return routeURL === requestURL;
    }
}

module.exports = { Server };
