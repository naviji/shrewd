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

    static save(o) {
        console.log("Saving a new", this.tableName())
        return this.db().save(this.tableName(), o)
       
    }

    static delete(name, id) {
        console.log("deleting a", this.tableName())
    }
}

export default BaseModel
