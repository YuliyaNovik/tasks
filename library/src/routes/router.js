class Router {
    constructor() {
        this.routes = [];
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
}

class ResourceRouter extends Router {
    constructor(resourceKey, controller) {
        super();
        this.resourceKey = resourceKey;
        this.get(`/${resourceKey}`, async (request, response) => {
            await controller.getAll(request, response);
        });
    
        this.post(`/${resourceKey}`, async (request, response) => {
            await controller.create(request, response);
        });

        const uri = new RegExp(`^/${resourceKey}/[1-9]\d*$`);
    
        this.get(uri, async (request, response) => {
            request.id = request.url.split(`/${resourceKey}/`)[1];
            await controller.get(request, response);
        });
    
        this.delete(uri, async (request, response) => {
            request.id = request.url.split(`/${resourceKey}/`)[1];
            await controller.deleteById(request, response);
        });
    }
}

module.exports = { Router, ResourceRouter };
