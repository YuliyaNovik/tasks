
const { getActivityPeriods } = require("./nbrb/activityPeriod");
const { getRatesForEachPeriod } = require("./nbrb/exchangeRate");
const { convertDate } = require("./nbrb/date");
const { createWriteStream } = require("./stream/writeStream");
const { pipeEvery } = require("./stream/pipe");
const { getFilePath } = require("./fileSystem/file");

const getFileName = (currency, startDate, endDate) => {
    return `${currency.abbreviation}_${convertDate(startDate)}-${convertDate(endDate)}.txt`;
}

const createOutputStream = (currency, startDate, endDate, outputPath) => {
    const fileName = getFileName(currency, startDate, endDate);
    const filePath = getFilePath(outputPath, fileName);
    return createWriteStream(filePath);
}

const writeRatesForCurrency = async (currency, allCurrencies, startDate, endDate, outputPath) => {
    const writeStream = createOutputStream(currency, startDate, endDate, outputPath)
    const activityPeriods = getActivityPeriods(currency, allCurrencies, startDate, endDate);
    const ratesStreams = await getRatesForEachPeriod(activityPeriods);
    return pipeEvery(ratesStreams, writeStream);
}

module.exports = { writeRatesForCurrency }