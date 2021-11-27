import Account from '../models/Account'
import AddCommand from './AddCommand'
import Transfer from '../models/Transfer'
import AddTransfer from './AddTransfer'
import timeUtils, { unixMsFromDate, timeInUnixMs, printDateOfToday } from '../utils/timeUtils'
import AddTransaction from './AddTransaction'
import Setting from '../models/Setting'

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
        const { createdDay } =  o 
        // TODO : Add 2 transactions for Transfer between accounts;
        const createdMonth = createdDay || timeUtils.timeInUnixMs()
        const createdAccount = super.execute(Object.assign({}, o, { createdMonth }))
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

        const createdTransfer = this.addTransferCmd.execute({
            from: Setting.get('moneyTreeId'),
            to: Setting.get('readyToAssignId'),
            createdMonth,
            amount: o.amount
        })
        return createdAccount
    }

    undo() {
        this.addTransactionCmd.undo()
        // this.addTransferCmd.undo()
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