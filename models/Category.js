import BaseModel from "./BaseModel.js"
import Calendar from "../utils/Calendar.js"
import Transfer from "./Transfer.js"
import Transaction from "./Transaction.js"
class Category extends BaseModel {
    static tableName = () => "category"

    static save =  (o) => {
        const { id, amount } = o
        if (!id && !amount) {
            // New Categories have default amount 0
            o.amount = 0
        }
        return super.save(o);
    }

    static getAmountAssignedOfMonth = (id) => {
        const currTime = Calendar.instance().timeInUnixMs()
        return Transfer.getAll().filter(x => x.categoryId === id && x.month === currTime)
                                .map(x => x.amount)
                                .reduce((a, b) => a+b, 0)
    }

    static getActivityOfMonth = (id) => {
        const transactions = Transaction.getAll().filter(x => x.categoryId === id)
        const start = Calendar.instance().startOfMonth()
        const end = Calendar.instance().endOfMonth()
        const relevantTransactions = transactions.filter( x => (start <= x.date && x.date <= end))
        const relevantAmounts =  relevantTransactions.map(x => x.inflow - x.outflow)
        return relevantAmounts.reduce((a, b) => a+b, 0)
    }

    static getAllActivity(id){
        const transactions = Transaction.getAll().filter(x => x.categoryId === id)
        const relevantAmounts =  transactions.map(x => x.inflow - x.outflow)
        return relevantAmounts.reduce((a, b) => a+b, 0)
    }

    static getNameFromId = (id) => {
        if (!id) return '--'
        return Category.getById(id).name
    }
}

export default Category