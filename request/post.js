const http = require("http");
const https = require("https");
const { urlToHttpOptions } = require("url");
const { createURL } = require("./url");

const getPostOptions = (url, bodyLength) => {
    const options = urlToHttpOptions(url);
    options.method = "POST";
    options.headers = {
        "Content-Type": "application/json",
        "Content-Length": bodyLength
    }

    return options;
}

const post = (urlString, data) => {
    return createURL(urlString)
        .then((url) => {
            return new Promise((resolve, reject) => {
                const body = JSON.stringify(data)
                const options = getPostOptions(url, body.length);
                const requestAlias = url.protocol == "http:" ? http : https;
                const request = requestAlias.request(options, (response) => {
                    console.log(`Status code: ${response.statusCode}`)
                    let data = "";
        
                    response.on("data", (chunk) => {
                        data += chunk;
                    });
        
                    response.on("end", () => resolve(data));
                }).on("error", (error) => {
                    return reject(error);
                });
        
                request.write(body)
                request.end()
            });
        })
}

module.exports = { post }
