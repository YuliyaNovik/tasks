const { writeThisSheet } = require("./modules/writeThisSheet");

const MONTH_COUNT = process.env.MONTH_COUNT || 3;
const OUTPUT_PATH = process.env.OUTPUT_PATH || "output";

writeThisSheet(MONTH_COUNT, OUTPUT_PATH);
