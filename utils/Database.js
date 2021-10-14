
class Database {

    constructor(logger) {
        this.setLogger(logger)
        this.logger().debug("Database initialized")
    }

    setLogger(logger) {
        this.logger_ = logger
    }

    logger() {
        return this.logger_
    }

    save(tableName, o) {
        if (!this[tableName]) this[tableName] = []
        const _createMockObjectDefaults = () => {
            const id = Math.floor(Math.random()*10000000)
            const created =  Date.now()
            const updated =  Date.now()
            return {id, created, updated}
        }

        const { id } = o
        let databaseObj
        if (id) {
            this.logger().debug(`Updating ${tableName} ${o.name}`)
            const found = this[tableName].find(x => x.id === id)
            if (!found) throw new Error("Object not found with id ", id)
            databaseObj = Object.assign(found, {updated : Date.now(), amount: o.amount})
        } else {
            this.logger().debug(`Creating ${tableName}`, o)
            databaseObj = { ...o , ..._createMockObjectDefaults()}
            this[tableName].push(databaseObj)
        }
        
        return databaseObj
    }

    getAll (tableName) {
        return this[tableName] ? this[tableName] : []
    }

    getByParentId(tableName, o) {
        const { parentId } = o
        return this[tableName].filter(x => x.parentId === parentId)
    }

    deleteById(tableName, o) {
        const { id } = o
        this[tableName] = this[tableName].filter(x => x.id !== id)
    }

    getById(tableName, id) {
        const found = this[tableName].find(x => x.id === id)
        if (!found) throw new Error("Object not found with id ", id)
        return found
    }

}

export default Database