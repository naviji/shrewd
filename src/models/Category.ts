import BaseItem from './BaseItem'
import Transfer from './Transfer'
import Transaction from './Transaction'
import timeUtils, { endOfMonth, startOfMonth } from '../utils/timeUtils'
import Setting from './Setting'
import Account from './Account'

class Category extends BaseItem {
    static tableName = () => 'Category'

    static fieldNames () {
      return ['id', 'parentId', 'name', 'updatedAt', 'createdAt']
    }

    static save = (o) => {
      const { id, amount, hidden } = o
      if (!id && !amount) {
        // New Categories have default amount 0
        o.amount = 0
      }
      if (!id && !hidden) {
        // New Categories are by default not hidden
        o.hidden = false
      }
      return super.save(o)
    }

    static assignMoney = (id, amount, date) => {
      const month = timeUtils.monthFromUnixMs(date)
      const transfer = Transfer.add({ from: Setting.get('readyToAssignId'), to: id, amount, createdMonth: month })
    }

    static assignedTillMonth = (id, month) => {
      const transfers = Transfer.getAll().filter(x => x.categoryId === id && x.createdMonth < month)
      return transfers.length ? transfers.map(x => x.amount).reduce((a, b) => a + b, 0) : 0
    }

    static activityTillMonth = (id, month) => {
      const transactions = Transaction.getAll().filter(x => x.categoryId === id)
      const relevantTransactions = transactions.filter(x => x.createdDay < month)
      const relevantAmounts = relevantTransactions.map(x => x.inflow - x.outflow)
      return relevantAmounts.length ? relevantAmounts.reduce((a, b) => a + b, 0) : 0
    }

    static getActivityOfMonth = (id, month) => {
      const transactions = Transaction.getAll().filter(x => x.categoryId === id)
      const start = startOfMonth(month)
      const end = endOfMonth(month)
      const relevantTransactions = transactions.filter(x => (start <= x.createdDay && x.createdDay <= end))
      const relevantAmounts = relevantTransactions.map(x => x.inflow - x.outflow)
      return relevantAmounts.length ? relevantAmounts.reduce((a, b) => a + b, 0) : 0
    }

    static getAllActivity (id) {
      const transactions = Transaction.getAll().filter(x => x.categoryId === id)
      const relevantAmounts = transactions.map(x => x.inflow - x.outflow)
      return relevantAmounts.reduce((a, b) => a + b, 0)
    }

    static getAllAssigned (id) {
      const _sum = (l) => l.length ? l.reduce((a, b) => a + b, 0) : 0

      const outflows = _sum(Transfer.getAll().filter(x => x.from === id).map(x => x.amount))
      const inflows = _sum(Transfer.getAll().filter(x => x.to === id).map(x => x.amount))
      return inflows - outflows
    }

    static getAllAssignedUptillMonth (id, month) {
      const _sum = (l) => l.length ? l.reduce((a, b) => a + b, 0) : 0

      const outflows = _sum(Transfer.getAll().filter(x => x.from === id && x.createdMonth <= month).map(x => x.amount))
      const inflows = _sum(Transfer.getAll().filter(x => x.to === id && x.createdMonth <= month).map(x => x.amount))
      return inflows - outflows
    }

    static getAssignedOfMonth (id, month) {
      const _sum = (l) => l.length ? l.reduce((a, b) => a + b, 0) : 0

      const outflows = _sum(Transfer.getAll().filter(x => x.from === id && x.createdMonth === month).map(x => x.amount))
      const inflows = _sum(Transfer.getAll().filter(x => x.to === id && x.createdMonth === month).map(x => x.amount))
      return inflows - outflows
    }

    static getAvailableOfMonth (categoryId, month) {
      // Available of a month is found recursively, with the base case taken
      // either as the month of first account creation date or Jan 2000 (arbitrary old date) if no accounts are created yet.
      const accounts = Account.getAll().sort((a, b) => a.createdDay - b.createdDay)
      const dayOfFirstAccountCreation = accounts.length ? accounts[0].createdDay : timeUtils.unixMsFromMonth('Jan 2000')
      const monthOfFirstAccountCreation = timeUtils.monthFromUnixMs(dayOfFirstAccountCreation)

      const _availableOnMonth = (categoryId, month) => {
        if (month < monthOfFirstAccountCreation) return 0
        const prevMonth = timeUtils.subtractMonth(month)
        return Category.getAssignedOfMonth(categoryId, month) +
                   Category.getActivityOfMonth(categoryId, month) +
                   _availableOnMonth(categoryId, prevMonth)
      }

      return _availableOnMonth(categoryId, month)
    }

    static getNameFromId = (id) => {
      if (!id) throw new Error(`Id can't be missing: ${id}`)
      if (id === Setting.get('readyToAssignId')) return 'Inflow: Ready to Assign'
      if (id === Setting.get('moneyTreeId')) return 'Money Tree: --'
      return Category.getById(id).name
    }

    static assignMoneyOnMonth = (id, amount, month) => {

    }
}

export default Category
