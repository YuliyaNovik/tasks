
const { getAllCurrencies, getCurrenciesOnDate } = require("./nbrb/nbrb");
const { writeRatesForCurrency } = require("./currency");

const writeExchangeRates = async (activeCurrencies, allCurrencies, startDate, endDate, outputPath, movingAverageInterval) => {
    const results = await Promise.allSettled(
        activeCurrencies.map((currency) => {
            writeRatesForCurrency(currency, allCurrencies, startDate, endDate, outputPath, movingAverageInterval);
        })
    );

    results.forEach((result) => result.status === "rejected" && console.log(result.reason));
}

const movingAverage = async (movingAverageInterval) => {
    try {
        const endDate = new Date();
        const startDate = new Date(endDate.getFullYear(), 0, 1);

        const activeCurrencies = await getCurrenciesOnDate(startDate);
        const allCurrencies = await getAllCurrencies();

        await writeExchangeRates(activeCurrencies, allCurrencies, startDate, endDate, movingAverageInterval);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { movingAverage }