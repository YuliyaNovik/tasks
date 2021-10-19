class Request {
    constructor(request) {
        this._request = request;
        this._request.url = decodeURIComponent(request.url)
        // TODO: set params
    }

    get url() {
        return this._request.url;
    }

    get method() {
        return this._request.method;
    }

    get body() {
        return this._request.body;
    }
}

module.exports = { Request };
