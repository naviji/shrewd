import BaseModel from "./BaseModel"
import Transaction from "./Transaction"

class Account extends BaseModel {
    static tableName = () => "account"

    static save =  (o) => {
        const { id, closed } = o
        if (!id && !closed) {
            // New accounts are open by default
            o.closed = false
        }
        return super.save(o);
    }

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