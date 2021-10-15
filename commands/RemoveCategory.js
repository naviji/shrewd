import Category from '../models/Category.js'
import Transaction from '../models/Transaction.js'
import Transfer from '../models/Transfer.js'
import RemoveCommand from './RemoveCommand.js'

class RemoveCategory extends RemoveCommand {
    model = () => Category

    constructor () {
        super()
        this.transfers  = []
        this.transactions = []
        this.prevId = null
        this.moveTransfers = null
    }

    execute = (o) => {
        const { id, newCategoryId, moveTransfers } = o
        this.prevId = id
        this.moveTransfers = moveTransfers
        this.transfers = Transfer.getAll().filter(x => x.categoryId === id)
        this.transactions = Transaction.getAll().filter(x => x.categoryId === id)

        if (!moveTransfers && !this.transactions.length) {
            for (let transfer of this.transfers) {
                // We're moving the money to readyToAssigned implicitly by removing all the transfers
                // since there aren't any transactions
                Transfer.deleteById(transfer.id)
            }
        } else {
            if (!newCategoryId)
                throw new Error("Must provide a new category id to move transactions to")
            
            for (let transfer of this.transfers) {
                Transfer.save(Object.assign(transfer, { categoryId: newCategoryId }))
            }

            for (let transaction of this.transactions) {
                Transaction.save(Object.assign(transaction, { categoryId: newCategoryId }))
            }
        }

        super.execute(o)
    }

    undo = () => {
        super.undo()
        if (!this.moveTransfers && !this.transactions.length) {
            for (let transfer of this.transfers) {
                Transfer.save(transfer)
            }
        } else {
            for (let transfer of this.transfers) {
                Transfer.save(Object.assign(transfer, { categoryId: this.prevId }))
            }

            for (let transaction of this.transactions) {
                Transaction.save(Object.assign(transaction, { categoryId: this.prevId }))
            }
        }
    }

    // redo = () => {

    // }


}

export default RemoveCategory