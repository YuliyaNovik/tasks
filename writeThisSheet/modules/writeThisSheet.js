
const { getAllCurrencies, getExchangeRates, getCurrenciesOnDate } = require("./nbrb");
const { createWriteStream } = require("./writeStream");
const { convertDate } = require("./date");

const parseCurrencyActivePeriod = async (writeStream, currency, allCurrencies, startDate, endDate) => {
    const isPeriodCovered = currency.endDate >= endDate;
    const exchangeRates = await getExchangeRates(currency.id, startDate, currency.endDate);

    writeStream.write(JSON.stringify(exchangeRates));

    if (isPeriodCovered) {
        return;
    }

    const nextCurrency = allCurrencies.find(item => item.parentId === currency.parentId && item.startDate > currency.endDate);
    if (nextCurrency) {
        setImmediate(() => parseCurrencyActivePeriod(writeStream, nextCurrency, allCurrencies, nextCurrency.startDate, endDate));
    }
}

const writeExchangeRates = async (currency, allCurrencies, startDate, endDate) => {
    const writeStream = createWriteStream(`${currency.abbreviation}_${convertDate(startDate)}-${convertDate(endDate)}.txt`);

    await parseCurrencyActivePeriod(writeStream, currency, allCurrencies, startDate, endDate)
}

const writeThisSheet = async (monthCount) => {
    try {
        const endDate = new Date();

        const startDate = new Date();
        startDate.setMonth((startDate).getMonth() - monthCount);

        const activeCurrencies = await getCurrenciesOnDate(startDate);

        const allCurrencies = await getAllCurrencies();

        await Promise.all(
            activeCurrencies.map((currency) => {
                return writeExchangeRates(currency, allCurrencies, startDate, endDate)
            })
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = { writeThisSheet }