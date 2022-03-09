import dayjs, { Dayjs } from 'dayjs'

class Calendar {
    now: Dayjs
    private static instance_: Calendar

    private constructor () {
      this.now = dayjs().startOf('month')
    }

    public static instance () {
      if (this.instance_) return this.instance_
      this.instance_ = new Calendar()
      return this.instance_
    }

    startOfMonth () {
      return this.timeInUnixMs()
    }

    endOfMonth () {
      return this.now.endOf('month').valueOf()
    }

    printMonth () {
      return this.now.format('MMMM')
    }

    printYear () {
      return this.now.format('YYYY')
    }

    timeInUnixMs () {
      return this.now.valueOf()
    }

    selectNextMonth () {
      this.now = this.now.add(1, 'month')
      // return this.printSelectedMonth()
    }

    selectPreviousMonth () {
      this.now = this.now.subtract(1, 'month')
      // return this.printSelectedMonth()
    }
}

export default Calendar
