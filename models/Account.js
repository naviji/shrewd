import BaseModel from "./BaseModel.js"

class Account extends BaseModel {
    static tableName = () => "account"

    static save = (o) => {
        return super.save(o)
    }
    static delete = (name, id) => {
        super.delete(name, id)
    }

    static getAll = () => {
        const options = {all : true}
        return this.db().get(this.tableName(), options)
    }
}

export default Account