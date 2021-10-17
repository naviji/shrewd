import Database from "../lib/Database"
import Logger from "../lib/Logger"
import BaseModel from "../models/BaseModel"
import BaseService from "../services/BaseService"

const logger = new Logger()
const database_ = new Map()

export const setupDatabaseAndSynchronizer = async (id) => {
    // console.log("Calling setup", n)
    BaseService.logger_ = logger
    database_[id] = new Database(logger)
    BaseModel.setDb(database_[id])

    // TODO: Create FILE API
}

export const switchClient = async (n) => {
    // console.log("Calling switch", n)
}