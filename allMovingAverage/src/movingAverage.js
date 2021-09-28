const { convertDate } = require("./nbrb/date");

const getMovingAverage = (ratesInterval, intervalLength) => {
    if (ratesInterval.length <= 0 || ratesInterval.length !== intervalLength) {
        throw Error("Lack of values");
    }
    return ratesInterval.reduce((acc, value) => acc += value, 0) / ratesInterval.length;
}

const calculateMovingAverage = (rates, intervalLength) => {
    let ratesInterval = [];
    const movingAverageRates = []; 
    rates.forEach((rate) => {
        if (ratesInterval.length >= intervalLength) {
            const movingAverage = getMovingAverage(ratesInterval, intervalLength);
            ratesInterval.splice(0, 1);
            ratesInterval.push(rate.officialRate);
            movingAverageRates.push({
                date: convertDate(rate.date),
                course: rate.officialRate,
                movingAverageCourse: movingAverage
            })
        } else {
            ratesInterval.push(rate.officialRate);
        }
    })
    return movingAverageRates;
}

module.exports = { calculateMovingAverage };