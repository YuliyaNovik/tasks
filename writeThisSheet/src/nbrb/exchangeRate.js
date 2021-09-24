
const { getExchangeRatesStream } = require("./nbrb");

const getRatesForEachPeriod = async (activityPeriods) => {
    const ratesStreams = (await Promise.allSettled(
            activityPeriods.map((period) => {
                return getExchangeRatesStream(period.id, period.startDate, period.endDate)
            })
        ))
        .filter((item) => item.status === "fulfilled")
        .map((item) => item.value);
    return ratesStreams;
}

module.exports = { getRatesForEachPeriod }