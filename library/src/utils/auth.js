const { JWT } = require("node-jsonwebtoken");

const jwt = new JWT(process.env.TOKEN_KEY);

module.exports = { jwt };
