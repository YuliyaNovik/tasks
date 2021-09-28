const { movingAverage } = require("./src/index");

const DAYS_IN_MONTH = 30;
const CURRENCY_ABBREVIATION = "USD";

movingAverage(CURRENCY_ABBREVIATION, DAYS_IN_MONTH);