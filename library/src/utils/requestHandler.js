class RequestHandler {
    constructor() {
        this.middlewares = [];
    }

    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }

    async _processMiddleware(request, response) {
        for (const middleware of this.middlewares) {
            let isCalled = false;
            const next = () => {
                isCalled = true;
            };

            await middleware(request, response, next);

            if (!isCalled) {
                return false;
            }
        }

        return true;
    }
}

module.exports = { RequestHandler };
