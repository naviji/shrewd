import timeUtils from "../utils/timeUtils"
import BaseItem from "./BaseItem"
import Setting from "./Setting"
import Transaction from "./Transaction"
import Transfer from "./Transfer"


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


class Account extends BaseItem {
    static tableName = () => 'Account'

    public static TYPE_SAVINGS = AccountType.Savings
    public static TYPE_CURRENT = AccountType.Current
    public static TYPE_OFF_BUDGET = AccountType.Savings

    static fieldNames() {
        return ["id", "type", "name", "amount", "updatedAt", "createdAt", "closed", "createdDay"]
    }

    static fieldTypes() {
        return {
            "type": Number,
            "amount": Number,
            "closed": (x) => !(x == 'false'),
            "createdDay": Number
        }
    }

    static save =  (o) => {
        const { id, closed, createdDay } = o
        if (!id && !closed) {
            // New accounts are open by default
            o.closed = false
        }

        return super.save(o);
    }

    static getNameFromId = (id) => {
        return Account.getById(id).name
    }
    

    static getBalance = (id) => {
        const balance = Transaction.getAll().filter(x => x.accountId === id && 
                                                    x.createdDay <= timeUtils.timeInUnixMs())
                            .map(x => x.inflow - x.outflow)
                            .reduce((a, b) => a + b, 0)
        return balance
    }

    static add = ({name, amount, type, createdDay}) => {
        const account = this.save({name, amount, type, createdDay})
        Transaction.add({
            createdDay,
            payee: "Starting Balance",
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