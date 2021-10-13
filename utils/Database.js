
class Database {

    constructor(logger) {
        this.setLogger(logger)
        this.logger().debug("Database initialized")
        const tableNames = ["account", "categoryGroup", "category"]
        for (const name of tableNames) {
            this[name] = []
        }
    }

    setLogger(logger) {
        this.logger_ = logger
    }

    logger() {
        return this.logger_
    }

    save(tableName, o) {
        const _createMockObjectDefaults = () => {
            const id = Math.floor(Math.random()*10000000)
            const created =  Date.now()
            const updated =  Date.now()
            return {id, created, updated}
        }

        let databaseObj = { ...o , ..._createMockObjectDefaults()}
        this[tableName].push(databaseObj)
        return databaseObj
    }

    get (tableName, options) {
        // this.logger().debug("get invoke with ", tableName)
        if (!!options.all) {
            // this.logger().debug(this[tableName])
            return this[tableName]
        }
        throw new Error("Get not implemented")
    }

}

export default Database