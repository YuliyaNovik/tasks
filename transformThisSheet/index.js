const { createReadStream, createWriteStream } = require("fs");

const INPUT_PATH = process.env.INPUT_PATH || "Karl_Marx-Das_Kapital.txt";
const OUTPUT_PATH = process.env.OUTPUT_PATH || "1.txt";

const main = async () => {
    const readStream = createReadStream(INPUT_PATH);
    const writeStream = createWriteStream(OUTPUT_PATH);

    let i = 1;
    readStream.on("data", (data) => {
        writeStream.write(data.toString().split("").filter((elem) => elem != "р" && elem !=  "Р").join(""));
    })

    readStream.on("error", (error) => {
        console.log(error);
        readStream.close();
    })

    writeStream.on("error", (error) => {
        console.log(error);
        writeStream.close();
    })
}

main();