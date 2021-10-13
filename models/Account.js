import BaseModel from "./BaseModel.js"

class Account extends BaseModel {
    static tableName = () => "account"

    static save = () => {
        super.save()
    }
}

export default Account