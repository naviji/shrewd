import dayjs from "dayjs"

class Calendar {
    constructor() {
        this.now = dayjs().startOf('month')
    }

    static instance() {
        if (this.instance_) return this.instance_
        this.instance_ = new Calendar()
        return this.instance_
    }

    startOfMonth() {
        return this.timeInUnixMs();
    }

    endOfMonth() {
        return this.now.endOf('month').valueOf()
    }

    printMonth() {
        return this.now.format("MMMM")
    }

    timeInUnixMs () {
        return this.now.valueOf() 
    }

    selectNextMonth() {
        this.now = this.now.add(1, 'month')
        // return this.getSelectedMonth()
    }

    selectPreviousMonth() {
        this.now = this.now.subtract(1, 'month')
        // return this.getSelectedMonth()
    }
}

export default Calendar