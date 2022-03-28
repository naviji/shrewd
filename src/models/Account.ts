import timeUtils from '../utils/timeUtils'
import BaseItem from './BaseItem'
import Setting from './Setting'
import Transaction, { TransactionItemInterface } from './Transaction'
import Transfer from './Transfer'

export enum AccountType {
	Savings = 1,
	Current = 2,
    OffBudget = 3
}

// class BaseModel {

//     public static TYPE_ACCOUNT = ModelType.Account;
// 	public static TYPE_CATEGORY = ModelType.Category;
// 	public static TYPE_CATEGORY_GROUP = ModelType.CategoryGroup;
// 	public static TYPE_TARGET = ModelType.Target;
// 	public static TYPE_TRANSACTION = ModelType.Transaction;
// 	public static TYPE_TRANSFER = ModelType.Transfer;

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
    createdDay: number
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
      const { id, closed, createdDay } = o
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

    static add = ({ name, amount, type, createdDay }: AccountSaveItemInterface) => {
      const account = this.save({ name, amount, type, createdDay })
      Transaction.add({
        createdDay,
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
