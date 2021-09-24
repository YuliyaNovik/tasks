class Currency {
    constructor(id, parentId, code, abbreviation, startDate, endDate) {
        this.id = id;
        this.parentId = parentId;
        this.code = code;
        this.abbreviation = abbreviation;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

module.exports = { Currency }