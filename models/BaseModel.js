class BaseModel {
    static tableName() {
        throw new Error("Needs to be overriden")
    }

    static setDb(db) {
        this.db_ = db
    }

    static db() {
        return this.db_
    }

    static logger() {
        return this.db().logger()
    }

    static save(o) {
        BaseModel.logger().debug("Saving a new", this.tableName())
        return this.db().save(this.tableName(), o)
    }

    static getAll() {
        const options = {all : true}
        return this.db().get(this.tableName(), options)
    }

    static delete(name, id) {
        BaseModel.logger().debug("deleting a", this.tableName())
    }
}

export default BaseModel
