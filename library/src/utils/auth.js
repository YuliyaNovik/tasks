const { JWT } = require("node-jsonwebtoken");

const config = process.env;

const jwt = new JWT(config.TOKEN_KEY);

const verifyToken = async (request, response, next) => {
    const token = request.headers["x-access-token"];

    if (!token) {
        return response.statusCode(403).end("Token is required for authentication");
    }
    try {
        request.user = await jwt.verify(token, config.TOKEN_KEY);
        return next();
    } catch (err) {
        return response.statusCode(401).end("Invalid Token");
    }
};

module.exports = { jwt, verifyToken };
