const { isBetween } = require("./date");

const getActivityPeriods = (currency, allCurrencies, startDate, endDate) => {
    return allCurrencies
        .filter((item) => {
            return item.parentId === currency.parentId && 
            (isBetween(item.endDate, startDate, endDate) || isBetween(item.startDate, startDate, endDate))
        })
        .map((item) => {
            return {
                id: item.id,
                startDate: item.startDate < startDate ? startDate : item.startDate,
                endDate: item.endDate < endDate ? item.endDate : endDate
            };
        })
        .sort((a, b) => a.startDate - b.startDate);
}

module.exports = { getActivityPeriods}
