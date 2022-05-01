import Account from '../models/Account'
import Transfer from '../models/Transfer'
import { CommandParams } from '../types/Command'
import { TransferEntity, AccountEntity } from '../types/Model'
class ConvertAccount {
  // Convert a budgeting account to a tracking account,
  // by removing all associated transfers

    private transfers: TransferEntity[]
    private accountId: string | null
    private oldAccount: AccountEntity | null

    // model = () => Account

    constructor () {
      // this.addTransactionCmd = new AddTransaction()
      this.transfers = []
      this.accountId = null
      this.oldAccount = null
    }

    execute (o: CommandParams.ConvertAccount) {
      const { accountId } = o

      this.oldAccount = Account.getById(accountId)

      if (!this.oldAccount) return
      Account.save({ ...this.oldAccount, type: Account.TYPE_OFF_BUDGET })

      this.transfers = Transfer.getByAttrWithValue('accountId', accountId)

      for (const transfer of this.transfers) {
        Transfer.deleteById(transfer.id)
      }
    }

    undo () {
      if (this.oldAccount) {
        for (const transfer of this.transfers) {
          Transfer.save(transfer)
        }
        Account.save(this.oldAccount)
      }
    }

    redo () {
      if (this.accountId) {
        this.execute({ accountId: this.accountId })
      }
    }
}

export default ConvertAccount
