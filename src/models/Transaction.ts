import timeUtils from "../utils/timeUtils"
import BaseItem from "./BaseItem"
import Setting from "./Setting"
import Transfer from "./Transfer"
class Transaction extends BaseItem {
    static tableName = () => "Transaction"

    static fieldNames() {
        return ["id", "createdDay", "payee", "categoryId", "accountId", "memo", "outflow", "inflow", "cleared", "updatedAt", "createdAt"]
    }

    static fieldTypes() {
        return {
            "inflow": Number,
            "outflow": Number,
            "cleared": x => !(x == 'false'),
            "createdDay": Number
        }
    }

    static add(o) {
        const { categoryId, inflow, outflow, createdDay, accountId } = o
        const transaction = this.save(o)

        if ( categoryId === Setting.get('readyToAssignId') || categoryId === Setting.get('moneyTreeId')) {
            Transfer.add({
                from: Setting.get('moneyTreeId'),
                to: Setting.get('readyToAssignId'),
                amount: inflow - outflow,
                createdMonth: timeUtils.monthFromUnixMs(createdDay),
                accountId: accountId
         })
        }

        return transaction
    }
}

export default Transaction