const { existsSync } = require("fs");
const { mkdir, readdir } = require("fs/promises");
const createGzip = require("./modules/gzip");

const INPUT_PATH = process.env.INPUT_PATH || "input";
const OUTPUT_PATH = process.env.OUTPUT_PATH || "output";

const main = async () => {
    try {
        if (!existsSync(INPUT_PATH)) {
            console.log("Directory 'input' doesn't exist");
            return;
        }

        if (!existsSync(OUTPUT_PATH)) {
            await mkdir(OUTPUT_PATH);
        }
        
        const files = await readdir(INPUT_PATH);

        await Promise.all(
            files.map((file) => createGzip(INPUT_PATH, OUTPUT_PATH, file))
        );
        
        console.log("Finished");
    } catch (error) {
        console.log(error);
    }
}

main();

