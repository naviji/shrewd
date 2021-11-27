import BaseItem from "./BaseItem"
import Transfer from "./Transfer"
import Transaction from "./Transaction"
import { endOfMonth, startOfMonth } from "../utils/timeUtils"
import Setting from "./Setting"


class Category extends BaseItem {
    static tableName = () => "Category"


    static fieldNames() {
        return ["id", "parentId", "name", "updatedAt", "createdAt"]
    }

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
        const transfers = Transfer.getAll().filter(x => x.categoryId === id && x.createdMonth < month)
        return transfers.length ? transfers.map(x => x.amount).reduce((a, b) => a+b, 0) : 0
    }

    static activityTillMonth = (id, month) => {
        const transactions = Transaction.getAll().filter(x => x.categoryId === id)
        const relevantTransactions = transactions.filter( x => x.createdDay < month)
        const relevantAmounts =  relevantTransactions.map(x => x.inflow - x.outflow)
        return relevantAmounts.length ? relevantAmounts.reduce((a, b) => a+b, 0) : 0
    }

    // static getAssignedOfMonth = (id, month) => {
    //     const result = this.getAllAssignedUptillMonth(id, month)
    //     const transfers = Transfer.getAll().filter(x => x.categoryId === id && x.createdMonth === month)
    //     if (transfers.length) {
    //         let result = transfers.map(x => x.amount)
    //         result = result.reduce((a, b) => a+b, 0)
    //         return result
    //     }
    //     return 0
    // }

    static getActivityOfMonth = (id, month) => {
        const transactions = Transaction.getAll().filter(x => x.categoryId === id)
        const start = startOfMonth(month)
        const end = endOfMonth(month)
        const relevantTransactions = transactions.filter( x => (start <= x.createdDay && x.createdDay <= end))
        const relevantAmounts =  relevantTransactions.map(x => x.inflow - x.outflow)
        return relevantAmounts.length ? relevantAmounts.reduce((a, b) => a+b, 0) : 0
    }

    static getAllActivity(id){
        const transactions = Transaction.getAll().filter(x => x.categoryId === id)
        const relevantAmounts =  transactions.map(x => x.inflow - x.outflow)
        return relevantAmounts.reduce((a, b) => a+b, 0)
    }

    static getAllAssigned(id) {
        const _sum = (l) => l.length ? l.reduce((a, b) => a+b, 0) : 0

        const outflows = _sum(Transfer.getAll().filter(x => x.from === id).map(x => x.amount))
        const inflows = _sum(Transfer.getAll().filter(x => x.to === id).map(x => x.amount))
        return inflows - outflows
    }

    static getAllAssignedUptillMonth(id, month) {
        const _sum = (l) => l.length ? l.reduce((a, b) => a+b, 0) : 0

        const outflows = _sum(Transfer.getAll().filter(x => x.from === id && x.createdMonth <= month).map(x => x.amount))
        const inflows = _sum(Transfer.getAll().filter(x => x.to === id && x.createdMonth <= month).map(x => x.amount))
        return inflows - outflows
    }

    static getAssignedOfMonth(id, month) {
        const _sum = (l) => l.length ? l.reduce((a, b) => a+b, 0) : 0

        const outflows = _sum(Transfer.getAll().filter(x => x.from === id && x.createdMonth === month).map(x => x.amount))
        const inflows = _sum(Transfer.getAll().filter(x => x.to === id && x.createdMonth === month).map(x => x.amount))
        return inflows - outflows
    }

    static getNameFromId = (id) => {
        if (!id) throw new Error(`Id can't be missing: ${id}`)
        if (id === Setting.get('readyToAssignId')) return 'Inflow: Ready to Assign'
        if (id === Setting.get('moneyTreeId')) return 'Money Tree: --'
        return Category.getById(id).name
    }
}

export default Category