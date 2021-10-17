import BaseModel from "./BaseModel"

class Transaction extends BaseModel {
    static tableName = () => "transaction"
}

export default Transaction