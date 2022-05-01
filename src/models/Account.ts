import timeUtils from '../utils/timeUtils'
import BaseItem from './BaseItem'
import Setting from './Setting'
import Transaction, { TransactionItemInterface } from './Transaction'

export enum AccountType {
  Savings = 1,
  Current = 2,
  OffBudget = 3
}

export interface AccountItemInterface {
    id: string;
    type: number;
    name: string;
    amount: number;
    updatedAt: number;
    createdAt: number;
    closed: boolean;
    createdDay: number
}

export interface AccountSaveItemInterface {
    id?: string
    closed?: boolean
    name: string
    amount: number
    type: number
}

class Account extends BaseItem {
    static tableName = () => 'Account'

    public static TYPE_SAVINGS = AccountType.Savings // Maybe change this to enum
    public static TYPE_CURRENT = AccountType.Current
    public static TYPE_OFF_BUDGET = AccountType.Savings

    static fieldNames () {
      return ['id', 'type', 'name', 'amount', 'updatedAt', 'createdAt', 'closed', 'createdDay']
    }

    static fieldTypes () {
      return {
        type: Number,
        amount: Number,
        closed: (x: string) => !(x === 'false'),
        createdDay: Number
      }
    }

    static save = (o: AccountSaveItemInterface) : AccountItemInterface => {
      const { id, closed } = o
      if (!id && !closed) {
        // New accounts are open by default
        o.closed = false
      }

      return super.save(o)
    }

    static getNameFromId = (id: string) => {
      return Account.getById(id).name
    }

    static getBalance = (id: string) => {
      const balance = Transaction.getAll()
        .filter((x: TransactionItemInterface) => x.accountId === id && x.createdDay <= timeUtils.timeInUnixMs())
        .map((x: TransactionItemInterface) => x.inflow - x.outflow)
        .reduce((a: number, b:number) => a + b, 0)
      return balance
    }

    static add = ({ name, amount, type }: AccountSaveItemInterface) => {
      const account = this.save({ name, amount, type })
      Transaction.add({
        createdDay: new Date(),
        payee: 'Starting Balance',
        categoryId: Setting.get('readyToAssignId'),
        accountId: account.id,
        memo: '--',
        outflow: 0,
        inflow: amount,
        cleared: true
      })
      return account
    }
}

export default Account
