import Setting from '../models/Setting'
import Transaction from '../models/Transaction'
import timeUtils from '../utils/timeUtils'
import AddCommand from './AddCommand'
import AddTransfer from './AddTransfer'
import { CommandParams } from '../types/Command'

class AddTransaction extends AddCommand {
    private addTransferCmd: AddTransfer | null

    model = () => Transaction

    constructor () {
      super()
      this.addTransferCmd = null
    }

    execute (o: CommandParams.AddTransaction) {
      const { categoryId, createdDay, inflow, outflow, accountId } = o

      const createdTransaction = super.execute(o)

      if (categoryId === Setting.get('readyToAssignId') || categoryId === Setting.get('moneyTreeId')) {
        this.addTransferCmd = new AddTransfer()
        this.addTransferCmd.execute({
          from: Setting.get('moneyTreeId'),
          to: Setting.get('readyToAssignId'),
          amount: inflow - outflow,
          createdMonth: timeUtils.getMonthFromDay(createdDay),
          accountId: accountId
        })
      }

      return createdTransaction
    }

    undo () {
      if (this.addTransferCmd) this.addTransferCmd.undo()
      super.undo()
    }

    redo () {
      const createdTransaction = super.redo()
      if (this.addTransferCmd) this.addTransferCmd.redo()
      return createdTransaction
    }
}

export default AddTransaction
