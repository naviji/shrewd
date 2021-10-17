import BaseModel from "./BaseModel.js"
import Calendar from "../utils/Calendar.js"
import Transfer from "./Transfer.js"
import Transaction from "./Transaction.js"
import { endOfMonth, startOfMonth } from "../utils/timeUtils.js"
class Category extends BaseModel {
    static tableName = () => "category"

    static save =  (o) => {
        const { id, amount, hidden } = o
        if (!id && !amount) {
            // New Categories have default amount 0
            o.amount = 0
        }
        if (!id && !hidden) {
            // New Categories are by default not hidden
            o.hidden = false
        }
        return super.save(o);
    }

    static assignedTillMonth = (id, month) => {
        const transfers = Transfer.getAll().filter(x => x.categoryId === id && x.date < month)
        return transfers.length ? transfers.map(x => x.amount).reduce((a, b) => a+b, 0) : 0
    }

    static activityTillMonth = (id, month) => {
        const transactions = Transaction.getAll().filter(x => x.categoryId === id)
        const relevantTransactions = transactions.filter( x => x.date < month)
        const relevantAmounts =  relevantTransactions.map(x => x.inflow - x.outflow)
        return relevantAmounts.length ? relevantAmounts.reduce((a, b) => a+b, 0) : 0
    }

    static getAssignedOfMonth = (id, month) => {
        const transfers = Transfer.getAll().filter(x => x.categoryId === id && x.date === month)
        if (transfers.length) {
            let result = transfers.map(x => x.amount)
            result = result.reduce((a, b) => a+b, 0)
            return result
        }
        return 0
    }

    static getActivityOfMonth = (id, month) => {
        const transactions = Transaction.getAll().filter(x => x.categoryId === id)
        const start = startOfMonth(month)
        const end = endOfMonth(month)
        const relevantTransactions = transactions.filter( x => (start <= x.date && x.date <= end))
        const relevantAmounts =  relevantTransactions.map(x => x.inflow - x.outflow)
        return relevantAmounts.length ? relevantAmounts.reduce((a, b) => a+b, 0) : 0
    }

    static getAllActivity(id){
        const transactions = Transaction.getAll().filter(x => x.categoryId === id)
        const relevantAmounts =  transactions.map(x => x.inflow - x.outflow)
        return relevantAmounts.reduce((a, b) => a+b, 0)
    }

    static getAllAssigned(id) {
        const transfers = Transfer.getAll().filter(x => x.categoryId === id)
        const relevantAmounts =  transfers.map(x => x.amount)
        return relevantAmounts.length ? relevantAmounts.reduce((a, b) => a+b, 0) : 0
    }

    static getNameFromId = (id) => {
        if (!id) return '--'
        return Category.getById(id).name
    }
}

export default Category