const { writeThisSheet } = require("./modules/writeThisSheet");

const MONTH_COUNT = process.env.MONTH_COUNT || 3;

writeThisSheet(MONTH_COUNT);
