import Account from '../models/Account'
import Transfer from '../models/Transfer'

class ConvertAccount {

    // Convert a budgeting account to a tracking account,
    // by removing all associated transfers

    private transfers
    private accountId
    private oldAccount

    // model = () => Account

    constructor() {
        // this.addTransactionCmd = new AddTransaction()
        this.transfers = []
        this.accountId = null
        this.oldAccount = null
    }

    execute (o) {
        this.oldAccount = o
        Account.save({...o, type: Account.TYPE_OFF_BUDGET})

        const { accountId } =  o 
        this.transfers = Transfer.getByAttrWithValue('accountId', accountId)

        for (const transfer of this.transfers) {
            Transfer.deleteById(transfer.id)
        }
    }

    undo() {
        for (const transfer of this.transfers) {
            Transfer.save(transfer)
        }

        Account.save(this.oldAccount)
    }

    redo() {
        this.execute({ accountId: this.accountId })
    }
}

export default ConvertAccount