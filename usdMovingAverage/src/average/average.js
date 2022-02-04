const getMovingAverage = (valuesInterval, intervalLength) => {
    if (valuesInterval.length <= 0 || valuesInterval.length !== intervalLength) {
        throw Error("Lack of values");
    }
    return valuesInterval.reduce((acc, value) => acc += value, 0) / valuesInterval.length;
}

module.exports = { getMovingAverage };