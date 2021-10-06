const { convertDate } = require("../nbrb/date");
const { getMovingAverage } = require("./average");

class MovingAverageInterval {
    constructor(length) {
        this._interval = [];
        this._intervalLength = length;
    }

    get movingAverage() {
        try {
            return getMovingAverage(this._interval, this._intervalLength);
        } catch (error) {
            return undefined;
        }
    }

    update(value) {
        if (this._interval.length < this._intervalLength) {
            this._add(value);
        } else {
            this._shift(value);
        }
    }

    _add(value) {
        this._interval.push(value);
    }

    _shift(value) {
        this._interval.splice(0, 1);
        this._interval.push(value);
    }
}

const calculateMovingAverage = (rates, intervalLength) => {
    const ratesInterval = new MovingAverageInterval(intervalLength);

    return rates.reduce((movingAverageRates, rate) => {
        const movingAverage = ratesInterval.movingAverage;
        ratesInterval.update(rate.officialRate);
        if (movingAverage) {
            movingAverageRates.push({
                date: convertDate(rate.date),
                course: rate.officialRate,
                movingAverageCourse: movingAverage
            })
        }
        return movingAverageRates;
    }, []);
}

module.exports = { calculateMovingAverage }; 