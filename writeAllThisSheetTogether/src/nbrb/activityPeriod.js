const { ActivityPeriod } = require("./models/activityPeriod");
const { isBetween } = require("./date");

const getActivityPeriods = (currency, allCurrencies, startDate, endDate) => {
    const activityPeriods = allCurrencies
        .filter((item) => {
            return item.parentId === currency.parentId && 
            (isBetween(item.endDate, startDate, endDate) || isBetween(item.startDate, startDate, endDate))
        })
        .map((item) => {
            const periodStart = item.startDate < startDate ? startDate : item.startDate;
            const periodEnd = item.endDate < endDate ? item.endDate : endDate;
            return new ActivityPeriod(item. id, periodStart, periodEnd);
        })
        .sort((a, b) => a.startDate - b.startDate)

    return activityPeriods;
}

module.exports = { getActivityPeriods}
