const http = require("http");
const https = require("https");
const { createURL } = require("./url");

const get = (urlString) => {
    return createURL(urlString)
        .then((url) => {
            return new Promise((resolve, reject) => {
                const requestAlias = url.protocol == "http:" ? http : https;
                requestAlias.get(url, (response) => {
                    let data = "";
        
                    response.on("data", (chunk) => {
                        data += chunk;
                    });
        
                    response.on("end", () => resolve(data));
                }).on("error", (error) => {
                    return reject(error);
                });
            })
        })
}

module.exports = { get };




