
const { calculateMovingAverage } = require("./movingAverage");
const { getActivityPeriods } = require("./nbrb/activityPeriod");
const { getRatesForEachPeriod } = require("./nbrb/exchangeRate");

const writeRatesWithMovingAverage = (currency, rates, intervalLength) => {
    console.log(currency.abbreviation);

    const movingAveragesRates = calculateMovingAverage(rates, intervalLength);

    movingAveragesRates.forEach((rate) => {
        console.log(rate);
    })
}

const writeRatesForCurrency = async (currency, allCurrencies, startDate, endDate, intervalLength) => {
    const shiftedDate = new Date();
    shiftedDate.setTime(startDate.getTime());
    shiftedDate.setDate(shiftedDate.getDate() - intervalLength);

    const activityPeriods = getActivityPeriods(currency, allCurrencies, shiftedDate, endDate);
    const ratesForActivityPeriods = await getRatesForEachPeriod(activityPeriods);
    writeRatesWithMovingAverage(currency, ratesForActivityPeriods.flat(), intervalLength);
}

module.exports = { writeRatesForCurrency }