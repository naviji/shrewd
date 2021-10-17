import dayjs from "dayjs"
// var customParseFormat = require('dayjs/plugin/customParseFormat')
// import {customParseFormat} from 'dayjs/plugin/customParseFormat'
// dayjs.extend(customParseFormat)


export const unixMsFromDate = (dateString) => {
    if (!dateString) {
        throw new Error("Provide dateString")
    }
    return dayjs(new Date(dateString)).valueOf()
}

export const dateFromUnixMs = (value) => {
    const unixMs = Number(value)
    return dayjs(unixMs).format('DD/MM/YYYY')
}

export const todayInUnixMs = () => {
    return dayjs().valueOf()
}

export const endOfMonth = (value) => {
    return dayjs(value).endOf('month')
}

export const startOfMonth = (value) => {
    return dayjs(value).startOf('month')
}

export const subtractMonth = (value) => {
    return dayjs(value).subtract(1, 'month').valueOf()
}

export const addMonth = (value) => {
    return dayjs(value).add(1, 'month').valueOf()
}

export const printDateOfToday = () => {
    return dayjs().format('DD/MM/YYYY')
}

export default {
    unixMsFromDate,
    dateFromUnixMs,
    todayInUnixMs,
    endOfMonth,
    startOfMonth,
    subtractMonth,
    addMonth
}