const http = require("http");
const { Response } = require("./utils/response");

class Server {
    constructor(port, hostName) {
        this.routers = [];
        this.clients = [];

        this._server = http.createServer(async (request, response) => {
            request.url = decodeURIComponent(request.url);

            const route = this.routers
                .map((router) => router.routes)
                .flat()
                .find((route) => this._compareURL(route.url, request.url) && route.method === request.method);

            const responseWrapper = new Response(response);
            if (route) {
                route.callback(request, responseWrapper);
                return;
            }
        });

        this._server.on("clientError", function onClientError(err, socket) {
            if (err.code === 'ECONNRESET' || !socket.writable) {
                return;
            }
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