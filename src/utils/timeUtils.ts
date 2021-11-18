import * as dayjs from "dayjs"
import timers from "timers"
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
    return timers.setTimeout(fn, interval);
};

export const setInterval = (fn, interval) => {
    return timers.setInterval(fn, interval);
};

export const clearTimeout = (id) => {
    return timers.clearTimeout(id);
};

export const clearInterval = (id) => {
    return timers.clearInterval(id);
};

export const unserializeDate = (value) => {
    return dayjs(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').valueOf()
}

export const serializeDate = (value) => {
    return `${dayjs(Number(value)).format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`
}

// if (['created_time', 'updated_time', 'sync_time', 'user_updated_time', 'user_created_time'].indexOf(propName) >= 0) {
//     if (!propValue) return '';
//     propValue = `${moment.unix(propValue / 1000).utc().format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`;
// } 

export default {
    unixMsFromDate,
    dateFromUnixMs,
    todayInUnixMs,
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
    serializeDate
}