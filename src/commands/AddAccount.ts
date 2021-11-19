import Account from '../models/Account'
import AddCommand from './AddCommand'
import Transfer from '../models/Transfer'
import AddTransfer from './AddTransfer'
import { unixMsFromDate, timeInUnixMs, printDateOfToday } from '../utils/timeUtils'
import AddTransaction from './AddTransaction'

class AddAccount extends AddCommand {
    private addTransferCmd
    private addTransactionCmd

    model = () => Account

    constructor() {
        super()
        this.addTransferCmd = new AddTransfer()
        this.addTransactionCmd = new AddTransaction()
    }

    execute (o) {
        const { date } = o
        const createdAccount = super.execute(o)
        const createdTransaction = this.addTransactionCmd.execute({
            date: timeInUnixMs(),
            payee: "Starting Balance",
            categoryId: null,
            accountId: createdAccount.id,
            memo: null,
            outflow: 0,
            inflow: o.amount,
            cleared: true
        })

        const createdTransfer = this.addTransferCmd.execute({
            date: date,
            categoryId: null,
            amount: o.amount
        })
        return createdAccount
    }

    undo() {
        this.addTransactionCmd.undo()
        this.addTransferCmd.undo()
        super.undo()
    }

    redo() {
        const createdAccount = super.redo()
        // We could probably remove this paramter to redo since we're preserving the ids
        this.addTransferCmd.redo({ accountId: createdAccount.id}) 
        return createdAccount
    }
}

export default AddAccount