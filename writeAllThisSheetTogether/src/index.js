
const { getAllCurrencies, getCurrenciesOnDate } = require("./nbrb/nbrb");
const { writeRatesForCurrency } = require("./currency");
const { createDir } = require("./fileSystem/dir");
const { createWriteStream } = require("./stream/writeStream");
const { convertDate } = require("./nbrb/date");
const { getFilePath } = require("./fileSystem/file");

const getFileName = (startDate, endDate) => {
    return `BLR|all_${convertDate(startDate)}-${convertDate(endDate)}.txt`;
}

const createOutputStream = (startDate, endDate, outputPath) => {
    const fileName = getFileName(startDate, endDate);
    const filePath = getFilePath(outputPath, fileName);
    return createWriteStream(filePath);
}

const writeExchangeRates = async (activeCurrencies, allCurrencies, startDate, endDate, writeStream) => {
    for (const currency of activeCurrencies) {
        await writeRatesForCurrency(currency, allCurrencies, startDate, endDate, writeStream);
    }
}

const writeThisSheet = async (monthCount, outputPath) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth((startDate).getMonth() - monthCount);

        await createDir(outputPath);

        const writeStream = createOutputStream(startDate, endDate, outputPath);

        const activeCurrencies = await getCurrenciesOnDate(startDate);
        const allCurrencies = await getAllCurrencies();
        await writeExchangeRates(activeCurrencies, allCurrencies, startDate, endDate, writeStream);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { writeThisSheet }