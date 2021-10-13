
class Database {

    constructor() {
        console.log("Database initialized")
        const tableNames = ["account", "categoryGroup", "category"]
        for (const name of tableNames) {
            this[name] = []
        }
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
        console.log("get invoke with ", tableName)
        if (!!options.all) {
            return this[tableName]
        }
        throw new Error("Get not implemented")
    }

}

export default Database