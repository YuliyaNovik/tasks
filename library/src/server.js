const http = require("http");
const { Request } = require("./utils/request");
const { Response } = require("./utils/response");

class Server {
    constructor(port, hostName) {
        this.routers = new Map();

        this._server = http.createServer(async (req, res) => {
            const request = new Request(req);
            const response = new Response(res);

            const router = this._findRouter(req.url);

            if (!router) {
                response.notFound(request.url);
                return;
            }
            router.navigate(request, response);
        });

        this._server.on("clientError", function onClientError(err, socket) {
            if (err.code === "ECONNRESET" || !socket.writable) {
                return;
            }
            console.log("clientError", err);
            socket.end("400 Bad Request\r\n\r\n");
        });

        this._server.listen(port, hostName, function () {
            console.log("Server is online");
        });
    }

    use(url, router) {
        this.routers.set(url, router);
    }

    _findRouter(url) {
        for (const routeKey of this.routers.keys()) {
            if (this._compareURL(routeKey, url)) {
                return this.routers.get(routeKey);
            }
        }
        return;
    }

    // check :
    _compareURL(routeURL, requestURL) {
        if (routeURL.test) {
            return routeURL.test(requestURL);
        }

        return routeURL === requestURL;
    }
}

module.exports = { Server };
