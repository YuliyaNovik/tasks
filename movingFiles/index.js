const { move } = require("./modules/moving");

const INPUT_PATH = process.env.INPUT_PATH || "input";
const OUTPUT_PATH = process.env.OUTPUT_PATH || "output";

move(INPUT_PATH, OUTPUT_PATH);
