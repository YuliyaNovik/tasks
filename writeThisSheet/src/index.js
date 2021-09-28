
const { getAllCurrencies, getCurrenciesOnDate } = require("./nbrb/nbrb");
const { writeRatesForCurrency } = require("./currency");
const { createDir } = require("./fileSystem/dir");

const writeExchangeRates = async (activeCurrencies, allCurrencies, startDate, endDate, outputPath) => {
    const results = await Promise.allSettled(
        activeCurrencies.map((currency) => {
            writeRatesForCurrency(currency, allCurrencies, startDate, endDate, outputPath);
        })
    );

    results.forEach((result) => result.status === "rejected" && console.log(result.reason));
}

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