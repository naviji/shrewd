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

    static getById(id) {
        return this.db().getById(this.tableName(), id)
    }

    static getAll() {
        return this.db().getAll(this.tableName())
    }

    static getByParentId(id) {
        return this.db().getByParentId(this.tableName(), id)
    }

    static deleteById(id) {
        return this.db().deleteById(this.tableName(), id)
    }
}

export default BaseModel
