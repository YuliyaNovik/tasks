const { RequestHandler } = require("../utils/requestHandler");
const { SpecifiedError } = require("../utils/specifiedError");

class Router extends RequestHandler {
    constructor(resourceKey) {
        super();
        this.routes = [];
        this.resourceKey = resourceKey;
        this.initMiddlewares();
    }

    async navigate(templateUrl, request, response) {
        const route = this._findRoute(request.url, request.method);
        if (!route) {
            console.log("Route is undefined");
            throw new SpecifiedError({ reason: "not_found" });
        }
        request.route = route.url;
        if (!(await this._processMiddleware(request, response))) {
            console.log("Error in middleware");
            throw new SpecifiedError({ reason: "bad_request" });
        }
        route.callback(request, response);
    }

    get(url, callback) {
        this._route("GET", url, callback);
    }

    put(url, callback) {
        this._route("PUT", url, callback);
    }

    post(url, callback) {
        this._route("POST", url, callback);
    }

    delete(url, callback) {
        this._route("DELETE", url, callback);
    }

    compareURL(routeURL, requestURL) {
        const urlParts = requestURL.split("/");
        const templateParts = routeURL.split("/");

        if (urlParts.length !== templateParts.length) {
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

    initMiddlewares() {
        this.addMiddleware((request, response, next) => {
            if (new RegExp(`^/${this.resourceKey}`).test(request.url)) {
                next();
            } else {
                console.log(`URL ${request.url} isn't supported by ${this.resourceKey} resource router`);
            }
        });

        this.addMiddleware((request, response, next) => {
            try {
                request.initParams();
                next();
            } catch (error) {
                console.log(error);
            }
        });

        this.addMiddleware((request, response, next) => {
            if (request.method !== "POST") {
                next();
                return;
            }
            if (!request.body) {
                response.badRequest("Body cannot be empty!");
            } else {
                next();
            }
        });
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
        super(resourceKey);
        this.resourceKey = resourceKey;
        this.initDefaultRoutes(controller);
    }

    initDefaultRoutes(controller) {
        this.get(`/${this.resourceKey}`, async (request, response) => {
            await controller.getAll(request, response);
        });

        this.post(`/${this.resourceKey}`, async (request, response) => {
            await controller.create(request, response);
        });

        this.get(`/${this.resourceKey}/:id`, async (request, response) => {
            await controller.get(request, response);
        });

        this.delete(`/${this.resourceKey}/:id`, async (request, response) => {
            await controller.deleteById(request, response);
        });
    }
}

module.exports = { Router, ResourceRouter };
