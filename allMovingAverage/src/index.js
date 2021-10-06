const { getAllCurrencies, getCurrenciesOnDate } = require("./nbrb/nbrb");
const { getCurrencyRates } = require("./currency/currency");
const { calculateMovingAverage } = require("./average/movingAverage");
const { log } = require("./log/log");

const getRatesForCurrency = async (currency, allCurrencies, startDate, endDate, intervalLength) => {
    const rates = await getCurrencyRates(currency, allCurrencies, startDate, endDate, intervalLength);
    return calculateMovingAverage(rates, intervalLength);
}

const writeMovingAverageRates = async (activeCurrencies, allCurrencies, startDate, endDate, intervalLength) => {
    const results = await Promise.allSettled(
        activeCurrencies.map(async (currency) => {
            const movingAverageRates = await getRatesForCurrency(currency, allCurrencies, startDate, endDate, intervalLength);
            log(currency.abbreviation, movingAverageRates);
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
        await writeMovingAverageRates(activeCurrencies, allCurrencies, startDate, endDate, movingAverageInterval);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { movingAverage } 