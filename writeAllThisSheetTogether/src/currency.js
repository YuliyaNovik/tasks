
const { getActivityPeriods } = require("./nbrb/activityPeriod");
const { getRatesForEachPeriod } = require("./nbrb/exchangeRate");
const { pipeEvery } = require("./stream/pipe");
const { createReadableStream } = require("./stream/readableStream");

const writeRatesForCurrency = async (currency, allCurrencies, startDate, endDate, writeStream) => {
    const activityPeriods = getActivityPeriods(currency, allCurrencies, startDate, endDate);
    const currencyInfoStream = createReadableStream(["\n" + currency.abbreviation + "\n"]);

    const ratesStreams = await getRatesForEachPeriod(activityPeriods);
    pipeEvery([currencyInfoStream, ...ratesStreams], writeStream);
}

module.exports = { writeRatesForCurrency }