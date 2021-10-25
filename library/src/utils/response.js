const { HttpStatusCode } = require("./httpStatusCode");

class Response {
    constructor(response) {
        this._response = response;
    }

    send(value) {
        this._response.write(value);
    }

    end(value) {
        this._response.end(value);
    }

    header(name, value) {
        this._response.setHeader(name, value);
        return this;
    }

    statusCode(httpCode) {
        this._response.statusCode = httpCode;
        return this;
    }

    badRequest(error) {
        this.statusCode(HttpStatusCode.BAD_REQUEST).end(error);
    }

    internalServerError(error) {
        this.statusCode(HttpStatusCode.INTERNAL_SERVER)
            .header("Content-Type", "text/plain")
            .end("Internal Server Error: " + error);
    }

    notFound(resourceKey) {
        this.statusCode(HttpStatusCode.NOT_FOUND)
            .header("Content-Type", "text/plain")
            .end("Not Found: " + resourceKey);
    }

    ok(data) {
        this.statusCode(HttpStatusCode.OK).header("Content-Type", "application/json").end(data);
    }

    created(location, data) {
        this.statusCode(HttpStatusCode.CREATED)
            .header("Location", location)
            .header("Content-Type", "application/json")
            .end(data);
    }
}

module.exports = { Response };
