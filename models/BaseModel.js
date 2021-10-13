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

    static save(ctx) {
        console.log("Saving a new ", this.tableName())
        this.db().save()
    }
}

export default BaseModel
