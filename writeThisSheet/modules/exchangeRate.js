
const { getExchangeRatesStream } = require("./nbrb");
const { createWriteStream } = require("./writeStream");
const { convertDate } = require("./date");
const { getActivityPeriods } = require("./activityPeriod");
const { pipeEvery } = require("./pipe");

const writeRatesForEachPeriod = async (writeStream, activityPeriods) => {
    const ratesStreams = (await Promise.allSettled(
            activityPeriods.map((period) => {
                return getExchangeRatesStream(period.id, period.startDate, period.endDate)
            })
        ))
        .filter((item) => item.status === "fulfilled")
        .map((item) => item.value);
    pipeEvery(ratesStreams, writeStream);
}

const writeExchangeRates = async (activeCurrencies, allCurrencies, startDate, endDate) => {
    const results = await Promise.allSettled(
        activeCurrencies.map(async (currency) => {
            const writeStream = createWriteStream(`${currency.abbreviation}_${convertDate(startDate)}-${convertDate(endDate)}.txt`);
            const activityPeriods = getActivityPeriods(currency, allCurrencies, startDate, endDate);
            return writeRatesForEachPeriod(writeStream, activityPeriods);
        })
    );

    results.forEach((result) => {
        if (result.status === "rejected") {
            console.log(result.reason)
        }
    });
}

module.exports = { writeExchangeRates }