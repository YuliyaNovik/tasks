const http = require("http");
const https = require("https");

const isProtocolSupported = (url) => {
    return url.protocol === "https:" || url.protocol === "http:";
}

module.exports = { isProtocolSupported };
