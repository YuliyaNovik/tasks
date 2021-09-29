const { URL, urlToHttpOptions } = require("url");

const PORT = 443;

const getPostOptions = (url, bodyLength) => {
    const options = urlToHttpOptions(url);
    options.port = PORT;
    options.method = "POST";
    options.headers = {
        "Content-Type": "application/json",
        "Content-Length": bodyLength
    }

    return options;
}

const post = (urlString, data) => {
    const url = new URL(urlString);
    const body = JSON.stringify(data)
    const options = getPostOptions(url, body.length);
    const protocol = getProtocol(url);

    return new Promise((resolve, reject) => {
        const request = protocol.request(options, (response) => {
            console.log(`Status code: ${response.statusCode}`)
            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (error) => {
            reject(error);
        });

        request.write(body)
        request.end()
    })
}

module.exports = { post }
