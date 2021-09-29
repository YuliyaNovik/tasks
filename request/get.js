const { URL } = require("url");
const { getProtocol } = require("./protocol");

const get = (urlString) => {
    return new Promise((resolve, reject) => {
        try {
            const url = new URL(urlString);
            const protocol = getProtocol(url);
            protocol.get(url, (response) => {
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
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { get };




