import timeUtils from "../utils/timeUtils"
import BaseItem from "./BaseItem"
import Transaction from "./Transaction"


export enum AccountType {
	Savings = 1,
	Current = 2,
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
    public static TYPE_CURRENT = AccountType.Savings

    static fieldNames() {
        return ["id", "type", "name", "amount", "updatedAt", "createdAt", "closed"]
    }

    static fieldTypes() {
        return {
            "type": Number,
            "amount": Number,
            "closed": (x) => !(x == 'false')
        }
    }

    static save =  (o) => {
        const { id, closed } = o
        if (!id && !closed) {
            // New accounts are open by default
            o.closed = false
        }
        return super.save(o);
    }

    static getNameFromId = (id) => {
        return Account.getById(id).name
    }

    static findByName = (name) => {
        const result =  Account.getByAttrWithValue('name', name)
        return result.length ? result[0] : null
    }

    static getBalance = (id) => {
        const balance = Transaction.getAll().filter(x => x.accountId === id && 
                                                    x.createdDay <= timeUtils.timeInUnixMs())
                            .map(x => x.inflow - x.outflow)
                            .reduce((a, b) => a + b, 0)
        return balance
    }
}

export default Account