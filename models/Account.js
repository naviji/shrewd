import BaseModel from "./BaseModel.js"
import Transaction from "./Transaction.js"

class Account extends BaseModel {
    static tableName = () => "account"

    static getNameFromId = (id) => {
        return Account.getById(id).name
    }

    static getBalance = (id) => {
        const balance = Transaction.getAll().filter(x => x.accountId === id)
                            .map(x => x.inflow - x.outflow)
                            .reduce((a, b) => a + b, 0)
        return balance
    }
}

export default Account