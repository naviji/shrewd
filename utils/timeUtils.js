import dayjs from "dayjs"

export const timeInUnixMs = (dateString) => {
    return dayjs(new Date(dateString)).valueOf()
}

export const dateFromUnixMs = (value) => {
    const unixMs = Number(value)
    return dayjs(unixMs).format('DD/MM/YYYY')
}

export const todayInUnixMs = () => {
    return dayjs().valueOf()
}