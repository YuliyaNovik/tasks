const http = require('http');

class Server {
    constructor(port, hostName) {
        this.routes = [];

        const server = http.createServer(async (request, response) => {
            const route = this.routes.find((route) => this._compareURL(route.url, request.url) && route.method === request.method);

            if (!route) {
                response.writeHead(404, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ message: "Route not found" }));
            }

            route.callback(request, response);
        })
        
        server.on('clientError', function onClientError(err, socket) {
            console.log('clientError', err)
            socket.end('400 Bad Request\r\n\r\n')
        })
        
        server.listen(port, hostName, function() {
            console.log('Server is online')
        })
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
            method
        });
    }

    _compareURL(routeURL, requestURL) {
        if (routeURL.test) {
            return routeURL.test(requestURL);
        }

        return routeURL === requestURL;
    }
}

module.exports = { Server }