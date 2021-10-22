const http = require("http");
const { Request } = require("./utils/request");
const { Response } = require("./utils/response");
const { RequestHandler } = require("./utils/requestHandler");
const { SpecifiedError } = require("./utils/specifiedError");

class Server extends RequestHandler {
    constructor(port, hostName) {
        super();
        this.routers = new Map();

        this._server = http.createServer(async (req, res) => {
            const request = new Request(req);
            const response = new Response(res);

            if (!(await this._processMiddleware(request, response))) {
                return;
            }

            try {
                const [templateUrl, router] = this._findRouterEntry(request.url);
                await router.navigate(templateUrl, request, response);
            } catch (error) {
                if (error.reason === "not_found") {
                    response.notFound(request.url);
                } else {
                    response.internalServerError("Cannot process request to " + request.url);
                }
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

    use(route, router) {
        if (this._isValidRoute(route)) {
            this.routers.set(route, router);
        } else {
            throw new Error("Invalid route: " + route);
        }
    }

    _isValidRoute(route) {
        return (
            route &&
            route.startsWith("/") &&
            route
                .split("/")
                .filter((part) => part)
                .every((part) => {
                    return (part.length > 1 && part.startsWith(":")) || (part.length > 0 && !part.startsWith(":"));
                })
        );
    }

    _findRouterEntry(url) {
        for (const entry of this.routers.entries()) {
            if (this._compareURL(entry[0], url)) {
                return entry;
            }
        }
        console.log("Cannot find router for: " + url);
        throw new SpecifiedError({ reason: "not_found" });
    }

    _compareURL(routeURL, requestURL) {
        const urlParts = requestURL.split("/");
        const templateParts = routeURL.split("/");

        if (
            urlParts.length < templateParts.length ||
            urlParts.length - templateParts.length > 1 ||
            !requestURL.startsWith("/") ||
            !routeURL.startsWith("/")
        ) {
            return false;
        }

        for (let i = 1; i < templateParts.length; i++) {
            const part = templateParts[i];
            if (!(part.length > 1 && part.startsWith(":")) && part !== urlParts[i]) {
                return false;
            }
        }

        return true;
    }
}

module.exports = { Server };
