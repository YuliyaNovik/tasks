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

    _route(method, url, callback) {
        this.routes.push({
            url,
            callback,
            method,
        });
    }
}

module.exports = { Router };