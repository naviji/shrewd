import Transfer from '../models/Transfer'

class ConvertAccount {

    // Convert a budgeting account to a tracking account,
    // by removing all associated transfers

    private transfers
    private accountId

    // model = () => Account

    constructor() {
        // this.addTransactionCmd = new AddTransaction()
        this.transfers = []
        this.accountId = null
    }

    execute (o) {

        // get all transfers with this accountId and delete them
        const { accountId } =  o 
        this.accountId = accountId
        this.transfers = Transfer.getByAttrWithValue('accountId', accountId)

        for (const transfer of this.transfers) {
            Transfer.deleteById(transfer.id)
        }
    }

    undo() {
        for (const transfer of this.transfers) {
            Transfer.save(transfer)
        }
    }

    redo() {
        this.execute({ accountId: this.accountId })
    }
}

export default ConvertAccount