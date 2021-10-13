import BaseModel from "./BaseModel.js"

class Transaction extends BaseModel {
    static tableName = () => "transaction"

    static save = () => {
        super.save()
    }
}

export default Transaction