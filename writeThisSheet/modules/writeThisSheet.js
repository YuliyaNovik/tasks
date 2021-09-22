
const { getAllCurrencies, getCurrenciesOnDate } = require("./nbrb");
const { writeExchangeRates } = require("./exchangeRate");

const writeThisSheet = async (monthCount) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth((startDate).getMonth() - monthCount);

        const activeCurrencies = await getCurrenciesOnDate(startDate);
        const allCurrencies = await getAllCurrencies();
        await writeExchangeRates(activeCurrencies, allCurrencies, startDate, endDate);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { writeThisSheet }