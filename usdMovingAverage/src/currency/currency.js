const { getActivityPeriods } = require("../nbrb/activityPeriod");
const { getRatesForEachPeriod } = require("../nbrb/exchangeRate");

const getPeriodsForCurrency = (currency, allCurrencies, startDate, endDate, intervalLength) => {
    const shiftedDate = new Date();
    shiftedDate.setTime(startDate.getTime());
    shiftedDate.setDate(shiftedDate.getDate() - intervalLength);
    return getActivityPeriods(currency, allCurrencies, shiftedDate, endDate);
}

const getRatesForPeriods = async (activityPeriods) => {
    const ratesForActivityPeriods = await getRatesForEachPeriod(activityPeriods);
    return ratesForActivityPeriods.flat();
}

const getCurrencyRates = async (currency, allCurrencies, startDate, endDate, intervalLength) => {
    const activityPeriods = getPeriodsForCurrency(currency, allCurrencies, startDate, endDate, intervalLength);
    return await getRatesForPeriods(activityPeriods)
}

module.exports = { getCurrencyRates }