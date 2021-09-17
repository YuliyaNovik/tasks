const { createReadStream } = require("fs");

const FILE_NAME = process.env.FILE_NAME || "Karl_Marx-Das_Kapital.txt";
const MESSAGE_LENGTH = process.env.MESSAGE_LENGTH || 15;

const main = async () => {
    const readStream = createReadStream(FILE_NAME);

    let i = 1;
    readStream.on("data", (data) => {
        console.log(`Chunk ${i++}, ${data.toString().slice(0, MESSAGE_LENGTH)}`);
    })

    readStream.on("error", (error) => {
        console.log(error);
        readStream.close();
    })
}

main();