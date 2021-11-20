import BaseItem from "./BaseItem"
class Transaction extends BaseItem {
    static tableName = () => "Transaction"

    static fieldNames() {
        return ["id", "date", "payee", "categoryId", "accountId", "memo", "outflow", "inflow", "cleared", "updatedAt", "createdAt"]
    }
}

export default Transaction