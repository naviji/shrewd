import BaseModel from "./BaseModel.js"

class Account extends BaseModel {
    static tableName = () => "account"

    static save = (name, options) => {
        super.save(name, options)
    }
    static delete = (name, id) => {
        super.delete(name, id)
    }
}

export default Account