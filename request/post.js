const { URL, urlToHttpOptions } = require("url");
const { getProtocol } = require("./protocol");

const getPostOptions = (url, bodyLength) => {
    const options = urlToHttpOptions(url);
    options.method = "POST";
    options.headers = {
        "Content-Type": "application/json",
        "Content-Length": bodyLength,
        "Authorization" :  "Bearer 0dc29e3dd7f2150891e88f13056fc44cd558dd0e8d43d064473c9ad803647de8"
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
