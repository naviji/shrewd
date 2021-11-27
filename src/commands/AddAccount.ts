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

        // TODO: Make commands atomic so that the state doesnot become inconsistent
        // Transfers and transactions created should either get reflected in the database together or not at all.
        const { createdDay } =  o 
        // TODO : Make account hold createdDay instead of createdMonth
        // Only transfers should have created month
        const createdMonth = createdDay || timeUtils.timeInUnixMs()
        const createdAccount = super.execute(Object.assign({}, o, { createdMonth })) // TODO: change to created Day
        // console.log(Setting.constants_)
        const createdTransaction = this.addTransactionCmd.execute({
            createdDay: createdMonth,
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