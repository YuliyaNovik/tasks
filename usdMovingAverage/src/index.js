
const { getAllCurrencies } = require("./nbrb/nbrb");
const { getCurrencyRates } = require("./currency/currency");
const { calculateMovingAverage } = require("./average/movingAverage");
const { log } = require("./log/log");

const getMovingAverageRates = async (currencyAbbreviation, allCurrencies, startDate, endDate, intervalLength) => {
    const currency = allCurrencies.find((elem) => elem.abbreviation == currencyAbbreviation && elem.id === elem.parentId);
    const rates = await getCurrencyRates(currency, allCurrencies, startDate, endDate, intervalLength);
    return calculateMovingAverage(rates, intervalLength);
}

const movingAverage = async (currencyAbbreviation, movingAverageInterval) => {
    try {
        const endDate = new Date();
        const startDate = new Date(endDate.getFullYear(), 0, 1);

        const allCurrencies = await getAllCurrencies();
        const movingAverageRates = await getMovingAverageRates(currencyAbbreviation, allCurrencies, startDate, endDate, movingAverageInterval);
    
        log(currencyAbbreviation, movingAverageRates);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { movingAverage }