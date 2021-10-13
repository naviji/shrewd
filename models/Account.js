import BaseModel from "./BaseModel.js"

class Account extends BaseModel {
    static tableName = () => "account"

    static save = (ctx) => {
        super.save(ctx)
    }
}

export default Account