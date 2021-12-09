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

    get headers() {
        return this._request.headers;
    }

    get body() {
        return this._body;
    }

    set route(route) {
        this._route = route;
    }

    initBody() {
        return new Promise((resolve, reject) => {
            let body = "";
            this._request.on("data", (chunk) => {
                body += chunk;
            });
            this._request.on("end", () => {
                if (this._request.headers["content-type"] !== "application/json") {
                    this._body = body;
                    resolve(this);
                    return;
                }

                try {
                    this._body = JSON.parse(body);
                    resolve(this);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    initParams() {
        if (!this._route) {
            throw new Error("Request route is undefined");
        }
        this.params = {};

        const urlParts = this._request.url.split("/");
        const templateParts = this._route.split("/");

        for (let i = 1; i < templateParts.length; i++) {
            const part = templateParts[i];
            if (part.length > 0 && part.startsWith(":")) {
                const parsedId = Number.parseInt(urlParts[i], 10);
                this.params[part.slice(1)] = Number.isNaN(parsedId) ? urlParts[i] : parsedId;
            }
        }
    }
}

module.exports = { Request };
