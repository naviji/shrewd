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

    static save(name, options) {
        console.log("Saving a new", this.tableName())
        if (this.tableName() === "account") {
            this.db_.setAccounts(options)
            console.log(this.db_.getAccounts())
        }
        else if (this.tableName() === "categoryGroup") {
            this.db_.setCategoryGroups(options)
            console.log(this.db_.getCategoryGroups())
        }
        else if (this.tableName() === "category") {
            this.db_.setCategoryGroups(options)
            console.log(this.db_.getCategoryGroups())
        }
    }

    static delete(name, id) {
        console.log("deleting a", this.tableName())
    }
}

export default BaseModel
