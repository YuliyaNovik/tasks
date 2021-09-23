const path = require("path");
const { convertDate } = require("./date");

const getFileName = (currency, startDate, endDate) => {
    return `${currency.abbreviation}_${convertDate(startDate)}-${convertDate(endDate)}.txt`;
}

const getFilePath = (currency, startDate, endDate, outputPath) => {
    const fileName = getFileName(currency, startDate, endDate);
    return path.join(outputPath, fileName);
}

module.exports = { getFilePath }