import BaseModel from "./BaseModel"

class Transaction extends BaseModel {
    static tableName = () => "transaction"

    static fieldNames() {
        return ["id", "date", "payee", "categoryId", "accountId", "memo", "outflow", "inflow", "cleared"]
    }
}

export default Transaction