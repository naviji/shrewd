import BaseModel from "./BaseModel.js"

class Account extends BaseModel {
    static tableName = () => "account"

    static save = (o) => {
        return super.save(o)
    }
    static delete = (name, id) => {
        super.delete(name, id)
    }
}

export default Account