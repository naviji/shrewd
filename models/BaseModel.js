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
        return this.db().save(this.tableName(), o)
    }

    static getAll() {
        return this.db().getAll(this.tableName())
    }

    static getByParentId(o) {
        return this.db().getByParentId(this.tableName(), o)
    }

    static delete(name, id) {
        throw new Error("Not implemented")
    }
}

export default BaseModel
