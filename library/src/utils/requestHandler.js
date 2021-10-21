class RequestHandler {
    constructor() {
        this.middlewares = [];
    }

    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }

    async _processMiddleware(request, response) {
        for (const middleware of this.middlewares) {
            let isResolved = false;
            const next = () => {
                isResolved = true;
            };

            await middleware(request, response, next);

            if (!isResolved) {
                return false
            }
        }

        return true;
    }
}

module.exports = {RequestHandler};