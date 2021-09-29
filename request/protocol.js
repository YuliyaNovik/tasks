const getProtocol = (url) => {
    if (url.protocol === "https:") {
        return https;
    }
    if (url.protocol === "http:") {
        return http;
    }
    throw Error(`Protocol "${url.protocol}" isn"t supported`);
}

module.exports = { getProtocol };
