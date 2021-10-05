const fs = require("fs");

const createWriteStream = (file) => {
    const writeStream = fs.createWriteStream(file);
    
    writeStream.on("error", (error) => {
        console.log(error);
        writeStream.close();
    })
    
    return writeStream;
}

module.exports = { createWriteStream }