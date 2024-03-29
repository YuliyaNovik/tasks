const convertDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.valueOf())) {
        throw Error("Date should be passed");
    }
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const isBetween = (date, startDate, endDate) => {
    return date <= endDate && date >= startDate;
}

module.exports = { convertDate, isBetween }