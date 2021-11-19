
import Logger from "./Logger"
import { timeInUnixMs } from "../utils/timeUtils"


let globalCounter = 0
class Database {

    private logger_: Logger

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
            const createdAt =  timeInUnixMs()
            const updatedAt =  timeInUnixMs()
            const index = globalCounter++ // TODO: Remove
            return {id, createdAt, updatedAt, index}
        }

        const { id } = o
        let databaseObj
        if (id) {
             // If id was provided; either I want to update the object with that id
             // or I want to create a new with exactly this id
            this.logger().debug(`Updating ${tableName} ${o.name}`)
            const found = this[tableName].find(x => x.id === id)
            if (!found) {
                // create a new object with exactly this id

                //TODO place object in exactly same index
                databaseObj = Object.assign({}, o, {
                    updatedAt : timeInUnixMs(),
                    createdAt : timeInUnixMs()})
                this[tableName].push(databaseObj)
            }
            else {
                // updating existing object with this id
                databaseObj = Object.assign(found,  o, {updated : timeInUnixMs()})
            }
        } else {
            // this.logger().debug(`Creating ${tableName}`, o)
            databaseObj = { ...o , ..._createMockObjectDefaults()}
            this[tableName].push(databaseObj)
        }
        
        this[tableName].sort((a, b) => a.index - b.index)
        return databaseObj
    }

    getAll (tableName) {
        return this[tableName] ? this[tableName] : []
    }

    getByParentId(tableName, id) {
        return this[tableName].filter(x => x.parentId === id)
    }

    deleteById(tableName, id) {
        this[tableName] = this[tableName].filter(x => x.id !== id)
    }

    getById(tableName, id) {
        const found = this[tableName].find(x => x.id === id)
        if (!found) throw new Error(`Object not found with id ${id}`)
        return found
    }

}

export default Database