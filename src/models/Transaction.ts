import BaseItem from "./BaseItem"
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
}

export default Transaction