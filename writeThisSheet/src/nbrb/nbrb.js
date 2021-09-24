const { get, getStream } = require("../request/request");
const { convertDate } = require("./date");
const { Currency } = require("./models/currency");
const { Rate } = require("./models/rate");

const getCurrency = async (id) => {
    const data = await get(`https://www.nbrb.by/api/exrates/currencies/${id}`);
    return toCurrency(data);
}

const getAllCurrencies = async () => {
    const data = await get("https://www.nbrb.by/api/exrates/currencies");
    return data.map(toCurrency);
}

const getRatesOnDate = async (date) => {
    const data = await get(`https://www.nbrb.by/api/exrates/rates?ondate=${convertDate(date)}&periodicity=0`);
    return data.map(toRate);
}

const getExchangeRates = async (id, startDate, endDate) => {
    const data = await get(`https://www.nbrb.by/api/exrates/rates/dynamics/${id}?startDate=${convertDate(startDate)}&endDate=${convertDate(endDate)}`);
    return data.map(toRate);
}

const getExchangeRatesStream = async (id, startDate, endDate) => {
    return getStream(`https://www.nbrb.by/api/exrates/rates/dynamics/${id}?startDate=${convertDate(startDate)}&endDate=${convertDate(endDate)}`);
}

const getCurrenciesOnDate = async (date) => {
    const ratesOnDate = await getRatesOnDate(date);

    return Promise.all(
        ratesOnDate.map((rate) => getCurrency(rate.id))
    );
}

const toRate = (rate) => {
    return new Rate(rate.Cur_ID, new Date(Date.parse(rate.Date)), rate.Cur_OfficialRate);
}

const toCurrency = (currency) => {
    const startDate = new Date(Date.parse(currency.Cur_DateStart));
    const endDate = new Date(Date.parse(currency.Cur_DateEnd));
    return new Currency(currency.Cur_ID, currency.Cur_ParentID, currency.Cur_Code, currency.Cur_Abbreviation, startDate, endDate);
}

module.exports = { getAllCurrencies, getRatesOnDate, getCurrency, getExchangeRates, getCurrenciesOnDate, getExchangeRatesStream }