const { getExchangeRates } = require("./nbrb");

const getRatesForEachPeriod = async (activityPeriods) => {
    const rates = (await Promise.allSettled(
            activityPeriods.map((period) => {
                return getExchangeRates(period.id, period.startDate, period.endDate)
            })
        ))
        .filter((item) => item.status === "fulfilled")
        .map((item) => item.value);
    return rates;ß
}

module.exports = { getRatesForEachPeriod } 