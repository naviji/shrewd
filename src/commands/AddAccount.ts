import Account from '../models/Account'
import AddCommand from './AddCommand'
import Transfer from '../models/Transfer'
import AddTransfer from './AddTransfer'
import timeUtils, { unixMsFromDate, timeInUnixMs, printDateOfToday } from '../utils/timeUtils'
import AddTransaction from './AddTransaction'
import Setting from '../models/Setting'

class AddAccount extends AddCommand {
    private addTransactionCmd

    model = () => Account

    constructor() {
        super()
        this.addTransactionCmd = new AddTransaction()
    }

    execute (o) {
        const { createdDay } = o
        const createdAccount = super.execute(o)
        const createdTransaction = this.addTransactionCmd.execute({
            createdDay,
            payee: "Starting Balance",
            categoryId: Setting.get('readyToAssignId'),
            accountId: createdAccount.id,
            memo: '--',
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
        return createdAccount
    }
}

export default AddAccount