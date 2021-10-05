const { isProtocolSupported } = require("./protocol");
const { URL } = require("url");

const createURL = (urlString) => {
    return new Promise((resolve, reject) => {
        try {
            const url = new URL(urlString);
            const isSupported = isProtocolSupported(url);
            if (isSupported) {
                return resolve(url);
            }
            return reject(new Error(`Protocol "${url.protocol}" isn"t supported`));
        } catch (error) {
            return reject(error);
        }
    });
}

module.exports = { createURL };