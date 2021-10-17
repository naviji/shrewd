import BaseModel from "./BaseModel.js"

class Transaction extends BaseModel {
    static tableName = () => "transaction"
}

export default Transaction