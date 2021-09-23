
const { getExchangeRatesStream } = require("./nbrb");
const { createWriteStream } = require("./writeStream");
const { getActivityPeriods } = require("./activityPeriod");
const { pipeEvery } = require("./pipe");
const { getFilePath } = require("./outputFile");

const getRatesForEachPeriod = async (activityPeriods) => {
    const ratesStreams = (await Promise.allSettled(
            activityPeriods.map((period) => {
                return getExchangeRatesStream(period.id, period.startDate, period.endDate)
            })
        ))
        .filter((item) => item.status === "fulfilled")
        .map((item) => item.value);
    return ratesStreams;
}

const writeRatesToFile = async (currency, allCurrencies, startDate, endDate, writeStream) => {
    const activityPeriods = getActivityPeriods(currency, allCurrencies, startDate, endDate);
    const ratesStreams = await getRatesForEachPeriod(activityPeriods);
    return pipeEvery(ratesStreams, writeStream);
}

const writeRatesForCurrency = (currency, allCurrencies, startDate, endDate, outputPath) => {
    const filePath = getFilePath(currency, startDate, endDate, outputPath);
    const writeStream = createWriteStream(filePath);
    return writeRatesToFile(currency, allCurrencies, startDate, endDate, writeStream);
}
 
const writeExchangeRates = async (activeCurrencies, allCurrencies, startDate, endDate, outputPath) => {
    const results = await Promise.allSettled(
        activeCurrencies.map((currency) => {
            writeRatesForCurrency(currency, allCurrencies, startDate, endDate, outputPath);
        })
    );

    results.forEach((result) => result.status === "rejected" && console.log(result.reason));
}

module.exports = { writeExchangeRates }