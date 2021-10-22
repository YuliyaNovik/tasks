const toTimeStamp = (date) => {
    if (!(date instanceof Date) || isNaN(date.valueOf())) {
        throw Error("Date should be passed");
    }
    return date.toJSON().slice(0, 19).replace("T", " ");
};

module.exports = { toTimeStamp };
