
const { getExchangeRatesStream } = require("./nbrb");
const { createWriteStream } = require("./writeStream");
const { convertDate } = require("./date");

const parseCurrencyActivePeriod = async (writeStream, currency, allCurrencies, startDate, endDate) => {
    const ratesStream = await getExchangeRatesStream(currency.id, startDate, currency.endDate);
    ratesStream.pipe(writeStream, { end: false });

    if (currency.endDate >= endDate) {
        return;
    }

    const nextCurrency = allCurrencies.find(item => item.parentId === currency.parentId && item.startDate > currency.endDate);
    if (nextCurrency) {
        setImmediate(() => parseCurrencyActivePeriod(writeStream, nextCurrency, allCurrencies, nextCurrency.startDate, endDate));
    }
}

const writeExchangeRates = async (activeCurrencies, allCurrencies, startDate, endDate) => {
    const results = await Promise.allSettled(
        activeCurrencies.map(async (currency) => {
            const writeStream = createWriteStream(`${currency.abbreviation}_${convertDate(startDate)}-${convertDate(endDate)}.txt`);
            return parseCurrencyActivePeriod(writeStream, currency, allCurrencies, startDate, endDate);
        })
    );

    results.forEach((result) => {
        if (result.status === "rejected") {
            console.log(result.reason)
        }
    });
}

module.exports = { writeExchangeRates }