class Request {
    constructor(request) {
        this._request = request;
        this._request.url = decodeURIComponent(request.url);
    }

    get url() {
        return this._request.url;
    }

    get method() {
        return this._request.method;
    }

    get body() {
        return this._body;
    }

    initBody() {
        return new Promise((resolve) => {
            let body = "";
            if (this._request.headers["content-type"] === "application/json") {
                this._request.on('data', chunk => {
                    body += chunk;
                });
                this._request.on('end', () => {
                    this._body = JSON.parse(body);
                    resolve();
                });
            }
        });
    }

    initParams(templateUrl) {
        this.params = {};

        const urlParts = this._request.url.split("/");
        const templateParts = templateUrl.split("/");

        for (let i = 1; i < templateParts.length; i++) {
            const part = templateParts[i];
            if (part.length > 0 && part.startsWith(":")) {
                const parsedId = Number.parseInt(urlParts[i], 10);
                this.params[part.slice(1)] = Number.isNaN(parsedId) ? urlParts[i] : parsedId;
            }
        }
    }
}

module.exports = {Request};
