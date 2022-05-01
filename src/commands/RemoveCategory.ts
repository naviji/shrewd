import Category from '../models/Category'
import Transaction from '../models/Transaction'
import Transfer from '../models/Transfer'
import RemoveCommand from './RemoveCommand'
import { TransferEntity, TransactionEntity } from '../types/Model'
import { CommandParams } from '../types/Command'

class RemoveCategory extends RemoveCommand {
    model = () => Category

    public transfers: TransferEntity[] = []
    public transactions: TransactionEntity[] = []
    public prevId: string | null = null
    public moveTransfers: Boolean | null = null

    execute = (o: CommandParams.RemoveCategory) => {
      const { id, newCategoryId, moveTransfers } = o
      this.prevId = id
      this.moveTransfers = moveTransfers
      this.transfers = Transfer.getAll().filter((x: TransferEntity) => x.from === id || x.to === id)
      this.transactions = Transaction.getAll().filter((x: TransactionEntity) => x.categoryId === id)

      if (!moveTransfers && !this.transactions.length) {
        for (const transfer of this.transfers) {
          // We're moving the money to readyToAssigned implicitly by removing all the transfers
          // since there aren't any transactions
          Transfer.deleteById(transfer.id)
        }
      } else {
        if (!newCategoryId) { throw new Error('Must provide a new category id to move transactions to') }

        for (const transfer of this.transfers) {
          Transfer.save(Object.assign(transfer, { categoryId: newCategoryId }))
        }

        for (const transaction of this.transactions) {
          Transaction.save(Object.assign(transaction, { categoryId: newCategoryId }))
        }
      }

      super.execute(o)
    }

    undo = () => {
      super.undo()
      if (!this.moveTransfers && !this.transactions.length) {
        for (const transfer of this.transfers) {
          Transfer.save(transfer)
        }
      } else {
        for (const transfer of this.transfers) {
          Transfer.save(Object.assign(transfer, { categoryId: this.prevId }))
        }

        for (const transaction of this.transactions) {
          Transaction.save(Object.assign(transaction, { categoryId: this.prevId }))
        }
      }
    }
}

export default RemoveCategory
