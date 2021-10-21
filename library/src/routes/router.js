const { HttpStatusCode } = require("../utils/httpStatusCode");
const { RequestHandler } = require("../utils/requestHandler");

class Router extends RequestHandler {
    constructor() {
        super();
        this.routes = [];
    }

    async navigate(templateUrl, request, response) {
        if (!(await this._processMiddleware(request, response))) {
            throw new Error("Middleware error");
        }

        const route = this._findRoute(request.url, request.method);
        if (!route) {
            throw new Error("Route is undefined");
        }
        request.initParams(templateUrl);
        route.callback(request, response);
    }

    get(url, callback) {
        this._route("GET", url, callback);
    }

    post(url, callback) {
        this._route("POST", url, callback);
    }

    delete(url, callback) {
        this._route("DELETE", url, callback);
    }

    compareURL(routeURL, requestURL) {
        if (routeURL.test) {
            return routeURL.test(requestURL);
        }

        return routeURL === requestURL;
    }

    _route(method, url, callback) {
        this.routes.push({
            url,
            callback,
            method,
        });
    }

    _findRoute(url, method) {
        return this.routes.find((route) => this.compareURL(route.url, url) && route.method === method);
    }
}

class ResourceRouter extends Router {
    constructor(resourceKey, controller) {
        super();
        this.resourceKey = resourceKey;
        this.initDefaultRoutes(controller);
        this.initMiddlewares();
    }

    initDefaultRoutes(controller) {
        this.get(`/${this.resourceKey}`, async (request, response) => {
            await controller.getAll(request, response);
        });

        this.post(`/${this.resourceKey}`, async (request, response) => {
            await controller.create(request, response);
        });

        const uri = new RegExp(`^/${this.resourceKey}/[1-9]\\d*$`);

        this.get(uri, async (request, response) => {
            request.params.id = request.url.split(`/${this.resourceKey}/`)[1];
            await controller.get(request, response);
        });

        this.delete(uri, async (request, response) => {
            request.params.id = request.url.split(`/${this.resourceKey}/`)[1];
            await controller.deleteById(request, response);
        });
    }

    initMiddlewares() {
        this.addMiddleware((request, response, next) => {
            if (this.compareURL(new RegExp(`^/${this.resourceKey}`), request.url)) {
                next();
            } else {
                console.log(`URL ${request.url} isn't supported by ${this.resourceKey} resource router`);
            }
        });

        this.addMiddleware((request, response, next) => {
            if (request.method !== "POST") {
                next();
                return;
            }
            if (!request.body) {
                response.statusCode(HttpStatusCode.BAD_REQUEST).send("Body cannot be empty!");
            } else {
                next();
            }
        });
    }
}

module.exports = { Router, ResourceRouter };
