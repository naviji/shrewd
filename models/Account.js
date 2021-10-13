import BaseModel from "./BaseModel.js"

class Account extends BaseModel {
    static tableName = () => "account"
}

export default Account