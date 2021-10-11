const http = require("http");
const { HttpStatusCode } = require("./utils/httpStatusCode");
const { getStaticResource } = require("./utils/staticResource");

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

            if (route) {
                route.callback(request, response);
                return;
            }

            try {
                const staticResource = await getStaticResource(request, response);
                if (staticResource) {
                    response.writeHead(HttpStatusCode.OK);
                    response.end(staticResource);
                } else {
                    response.writeHead(HttpStatusCode.NOT_FOUND, {"Content-Type": "text/plain"});
                    response.end("Not Found: " + request.url);
                }
            } catch (error) {
                response.writeHead(HttpStatusCode.INTERNAL_SERVER, { "Content-Type": "text/plain" });
                response.end("Internal Server Error: " + error);
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
