const { ActivityPeriod } = require("./models/activityPeriod");

const getActivityPeriods = (currency, allCurrencies, startDate, endDate) => {
    let activityPeriods = allCurrencies
        .filter((item) => {
            return item.parentId === currency.parentId && 
            (item.endDate <= endDate && item.endDate >= startDate || item.startDate <= endDate && item.startDate >= startDate)
        })
        .map((item) => {
            const periodStart = item.startDate < startDate ? startDate : item.startDate;
            const periodEnd = item.endDate < endDate ? item.endDate : endDate;
            return new ActivityPeriod(item. id, periodStart, periodEnd);
        })
    activityPeriods.sort((a, b) => a.startDate - b.startDate);
    return activityPeriods;
}

module.exports = { getActivityPeriods}
