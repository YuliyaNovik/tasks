
const { getAllCurrencies, getCurrenciesOnDate } = require("./nbrb");
const { writeExchangeRates } = require("./exchangeRate");
const { createDir } = require("./dir");

const writeThisSheet = async (monthCount, outputPath) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth((startDate).getMonth() - monthCount);

        await createDir(outputPath);

        const activeCurrencies = await getCurrenciesOnDate(startDate);
        const allCurrencies = await getAllCurrencies();
        await writeExchangeRates(activeCurrencies, allCurrencies, startDate, endDate, outputPath);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { writeThisSheet }