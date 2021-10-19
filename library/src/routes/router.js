class Router {
    constructor() {
        this.routes = [];
    }

    navigate(request, response) {
        const route = this._findRoute(request.url, request.method);
        if (!route) {
            throw new Error("Route is undefined");
        }
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
        return this.routes.find((route) => route.url === url && route.method === method);
    }
}

class ResourceRouter extends Router {
    constructor(resourceKey, controller, nestedRouters) {
        super();
        this.resourceKey = resourceKey;
        this.initDefaultRoutes(controller);
        this.registerNestedRouters(nestedRouters);
    }

    initDefaultRoutes(controller) {
        this.get(`/${this.resourceKey}`, async (request, response) => {
            await controller.getAll(request, response);
        });

        this.post(`/${this.resourceKey}`, async (request, response) => {
            await controller.create(request, response);
        });

        const uri = new RegExp(`^/${this.resourceKey}/[1-9]\d*$`);

        this.get(uri, async (request, response) => {
            request.id = request.url.split(`/${this.resourceKey}/`)[1];
            await controller.get(request, response);
        });

        this.delete(uri, async (request, response) => {
            request.id = request.url.split(`/${this.resourceKey}/`)[1];
            await controller.deleteById(request, response);
        });
    }

    registerNestedRouters(nestedRouters) {
        if (!nestedRouters) {
            return;
        }
        for (const nestedRouter of nestedRouters) {
            const nestedResourceKey = nestedRouter.resourceKey;
            const nestedResourceUrl = new RegExp(`^/${this.resourceKey}/[1-9]\d*/${nestedResourceKey}`);

            // TODO: check method
            this.get(nestedResourceUrl, async (request, response) => {
                request.primaryParams = {
                    userId: request.url.split(`/${this.resourceKey}/`)[1],
                };

                const newUrl = "/" + nestedResourceKey + request.url.split(nestedResourceKey)[1];
                const route = nestedRouter.routes.find(
                    (route) => this.compareURL(route.url, newUrl) && route.method === request.method
                );

                if (route) {
                    route.callback(request, response);
                } else {
                    // TODO: error
                }
            });
        }
    }
}

module.exports = { Router, ResourceRouter };
