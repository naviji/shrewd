import Account from '../models/Account'
import AddCommand from './AddCommand'
import AddTransaction from './AddTransaction'
import Setting from '../models/Setting'
import { CommandParams } from '../types/Command'

class AddAccount extends AddCommand {
    private addTransactionCmd

    model = () => Account

    constructor () {
      super()
      this.addTransactionCmd = new AddTransaction()
    }

    execute (o: CommandParams.AddAccount) {
      const createdAccount = super.execute(o)
      this.addTransactionCmd.execute({
        createdDay: new Date(),
        payee: 'Starting Balance',
        categoryId: Setting.get('readyToAssignId'),
        accountId: createdAccount.id,
        memo: '--',
        outflow: 0,
        inflow: o.amount,
        cleared: true
      })

      return createdAccount
    }

    undo () {
      this.addTransactionCmd.undo()
      super.undo()
    }

    redo () {
      const createdAccount = super.redo()
      return createdAccount
    }
}

export default AddAccount
