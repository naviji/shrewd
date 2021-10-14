import dayjs from 'dayjs'

export default {
    currentMonth: () => {
        return dayjs().format("MMMM")
    }
}