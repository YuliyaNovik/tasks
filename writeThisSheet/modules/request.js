const https = require("https");

const get = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = "";
    
            response.on("data", (chunk) => {
                data += chunk;
            });
    
            response.on("end", () => {
                resolve(JSON.parse(data));
            });
            
        }).on("error", (err) => {
            reject(err);
        });
    })
}

//const json = async (url) => await get(url).then(data => JSON.parse(data))

module.exports = { get }