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

    static save() {
        console.log("Saving a new ", this.tableName())
    }
}

export default BaseModel
