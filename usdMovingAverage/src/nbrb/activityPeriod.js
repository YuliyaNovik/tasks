const getActivityPeriods = (currency, allCurrencies, startDate, endDate) => {
    let activityPeriods = allCurrencies
        .filter((item) => {
            return item.parentId === currency.parentId && 
            (item.endDate <= endDate && item.endDate >= startDate || item.startDate <= endDate && item.startDate >= startDate)
        })
        .map((item) => {
            return {
                id: item.id,
                startDate: item.startDate < startDate ? startDate : item.startDate,
                endDate: item.endDate < endDate ? item.endDate : endDate
            };
        })
    activityPeriods.sort((a, b) => a.startDate - b.startDate);
    return activityPeriods;
}

module.exports = { getActivityPeriods}
