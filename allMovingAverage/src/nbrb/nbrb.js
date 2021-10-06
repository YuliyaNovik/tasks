const { get } = require("../request/request");
const { convertDate } = require("./date");

const getCurrency = async (id) => {
    const data = await get(`https://www.nbrb.by/api/exrates/currencies/${id}`);
    return currencyMapper(data);
}

const getAllCurrencies = async () => {
    const data = await get("https://www.nbrb.by/api/exrates/currencies");
    return data.map(currencyMapper);
}

const getRatesOnDate = async (date) => {
    const data = await get(`https://www.nbrb.by/api/exrates/rates?ondate=${convertDate(date)}&periodicity=0`);
    return data.map(rateMapper);
}

const getExchangeRates = async (id, startDate, endDate) => {
    const data = await get(`https://www.nbrb.by/api/exrates/rates/dynamics/${id}?startDate=${convertDate(startDate)}&endDate=${convertDate(endDate)}`);
    return data.map(rateMapper);
}

const getCurrenciesOnDate = async (date) => {
    const ratesOnDate = await getRatesOnDate(date);

    return Promise.all(
        ratesOnDate.map((rate) => getCurrency(rate.id))
    );
}

const rateMapper = (rate) => {
    return {
        id: rate.Cur_ID,
        date: new Date(Date.parse(rate.Date)),
        officialRate: rate.Cur_OfficialRate
    };
}

const currencyMapper = (currency) => {
    const startDate = new Date(Date.parse(currency.Cur_DateStart));
    const endDate = new Date(Date.parse(currency.Cur_DateEnd));

    return {
        id: currency.Cur_ID,
        parentId: currency.Cur_ParentID,
        code: currency.Cur_Code,
        abbreviation: currency.Cur_Abbreviation,
        startDate: startDate,
        endDate: endDate
    };
}

module.exports = { getAllCurrencies, getRatesOnDate, getCurrency, getExchangeRates, getCurrenciesOnDate }