import * as dayjs from "dayjs"
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const NanoTimer = require('nanotimer');
// var NanoTimer = require('nanotimer');
 
// import timers from "timers"
// var customParseFormat = require('dayjs/plugin/customParseFormat')
// import {customParseFormat} from 'dayjs/plugin/customParseFormat'
// dayjs.extend(customParseFormat)

const timers_ = {}


export const unixMsFromDate = (dateString) => {
    if (!dateString) {
        throw new Error("Provide dateString")
    }
    return dayjs(dateString, 'DD/MM/YYYY').valueOf()
}

const unixMsFromMonth = (dateString) => {
    // TODO: Remove and use unixMsFromDate with MM/DD/YYYY format instead
    // dateString in MM/DD/YYYY format
    if (!dateString) {
        throw new Error("Provide dateString")
    }
    return dayjs(new Date(dateString)).valueOf()
}

export const dateFromUnixMs = (value) => {
    const unixMs = Number(value)
    return dayjs(unixMs).format('DD/MM/YYYY')
}

export const timeInUnixMs = () => {
    return dayjs().valueOf()
}

export const monthInUnixMs = () => {
    return dayjs().startOf('month').valueOf()
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

export const msleep = (ms: number) => {
    return new Promise((resolve: Function) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export const sleep = (seconds: number) => {
    return msleep(seconds * 1000);
}

export const setTimeout = (fn, interval) => {
    const timer = new NanoTimer();
    const id = Math.floor(Math.random()*100000000);
    timer.setTimeout(fn, '', `${interval}m`);
    timers_[id] = timer
    return id
};

export const setInterval = (fn, interval) => {
    const timer = new NanoTimer();
    const id = Math.floor(Math.random()*100000000);
    timer.setInterval(fn, '', `${interval}m`);
    timers_[id] = timer
    return id
};

export const clearTimeout = (id) => {
    timers_[id].clearTimeout(id);
    delete timers_[id]
};

export const clearInterval = (id) => {
    timers_[id].clearInterval(id);
    delete timers_[id]
};

export const unserializeDate = (value) => {
    return dayjs(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').valueOf()
}

export const serializeDate = (value) => {
    return `${dayjs(Number(value)).format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`
}

const getMonthFromDay = (value) => {
    return dayjs(Number(value)).startOf('month').valueOf()
}

const getMonthsTillDate = (currentDate, endDate) => {
    const currentMonth = dayjs(currentDate).startOf('month')
    const endMonth = dayjs(endDate).startOf('month')
    return endMonth.diff(currentMonth, 'month') + 1
}

const monthFromUnixMs = (value) => {
    return dayjs(Number(value)).startOf('month').valueOf()
}

const getPrevMonthUnixMs = (value) => {
    return dayjs(Number(value)).startOf('month').subtract(1, 'month').valueOf()
}
// if (['createdAt', 'updatedAt', 'sync_time', 'user_updatedAt', 'user_createdAt'].indexOf(propName) >= 0) {
//     if (!propValue) return '';
//     propValue = `${moment.unix(propValue / 1000).utc().format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`;
// } 

export default {
    unixMsFromDate,
    dateFromUnixMs,
    timeInUnixMs,
    endOfMonth,
    startOfMonth,
    subtractMonth,
    addMonth,
    msleep,
    sleep,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    unserializeDate,
    serializeDate,
    unixMsFromMonth,
    getMonthFromDay,
    getMonthsTillDate,
    monthInUnixMs,
    monthFromUnixMs,
    getPrevMonthUnixMs
}