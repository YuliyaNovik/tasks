
const { getAllCurrencies } = require("./nbrb/nbrb");
const { writeRatesForCurrency } = require("./currency");

const movingAverage = async (currencyAbbreviation, movingAverageInterval) => {
    try {
        const endDate = new Date();
        const startDate = new Date(endDate.getFullYear(), 0, 1);

        const allCurrencies = await getAllCurrencies();
        const currency = allCurrencies.find((elem) => elem.abbreviation == currencyAbbreviation && elem.id === elem.parentId);

        await writeRatesForCurrency(currency, allCurrencies, startDate, endDate, movingAverageInterval);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { movingAverage }