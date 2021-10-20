const http = require("http");
const {Request} = require("./utils/request");
const {Response} = require("./utils/response");

class Server {
    constructor(port, hostName) {
        this.routers = new Map();
        this.middlewares = [];

        this._server = http.createServer(async (req, res) => {
            const request = new Request(req);
            const response = new Response(res);

            if (!await this._processMiddleware(request, response)) {
                return;
            }

            try {
                const [templateUrl, router] = this._findRouterEntry(request.url);
                router.navigate(templateUrl, request, response);
            } catch (error) {
                console.log(error);
                response.notFound(request.url);
            }
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

    async _processMiddleware(request, response) {
        for (const middleware of this.middlewares) {
            let isResolved = false;
            const next = () => {
                isResolved = true;
            };

            await middleware(request, response, next);

            if (!isResolved) {
                return false
            }
        }

        return true;
    }

    use(route, router) {
        if (this._isValidRoute(route)) {
            this.routers.set(route, router);
        } else {
            throw new Error("Invalid route: " + route);
        }
    }

    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }

    _isValidRoute(route) {
        return route && route.startsWith("/") && route.split("/").filter((part) => part).every((part) => {
            return (part.length > 1 && part.startsWith(":")) || (part.length > 0 && !part.startsWith(":"))
        });
    }

    _findRouterEntry(url) {
        for (const entry of this.routers.entries()) {
            if (this._compareURL(entry[0], url)) {
                return entry;
            }
        }
        throw new Error("Cannot find router for: " + url);
    }

    _compareURL(routeURL, requestURL) {
        const urlParts = requestURL.split("/");
        const templateParts = routeURL.split("/");

        if (urlParts.length < templateParts.length || urlParts.length - templateParts.length > 1 ||
            !requestURL.startsWith("/") || !routeURL.startsWith("/")) {
            return false;
        }

        for (let i = 1; i < templateParts.length; i++) {
            const part = templateParts[i];
            if (!(part.length > 0 && part.startsWith(":")) && part !== urlParts[i]) {
                return false;
            }
        }

        return true;
    }
}

module.exports = {Server};
