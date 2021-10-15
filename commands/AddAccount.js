import Account from '../models/Account.js'
import AddCommand from './AddCommand.js'
import Transaction from '../models/Transaction.js'
import AddTransaction from './AddTransaction.js'
import { todayInUnixMs } from '../utils/timeUtils.js'
class AddAccount extends AddCommand {
    model = () => Account

    constructor() {
        super()
        this.addTransactionCmd = new AddTransaction()
    }

    execute (o) {
        const createdAccount = super.execute(o)
        const createdTransaction = this.addTransactionCmd.execute({
            date: todayInUnixMs(),
            payee: "Starting Balance",
            categoryId: null,
            accountId: createdAccount.id,
            memo: null,
            outflow: 0,
            inflow: o.amount,
            cleared: true
        })
        return createdAccount
    }

    undo() {
        this.addTransactionCmd.undo()
        super.undo()
    }

    redo() {
        const createdAccount = super.redo()
        // We could probably remove this paramter to redo since we're preserving the ids
        this.addTransactionCmd.redo({ accountId: createdAccount.id}) 
        return createdAccount
    }
}

export default AddAccount