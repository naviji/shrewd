import BaseService from '../services/BaseService'
import Logger from '../lib/Logger'
import Database from '../lib/Database'
import BaseModel from '../models/BaseModel'
import Setting from '../models/Setting'

const logger = new Logger()
const databases_: {[index: number]: Database} = {}

export const setupDatabase = (id: number) => {
  BaseService.logger_ = logger
  databases_[id] = new Database(logger)
  BaseModel.setDb(databases_[id])
  Setting.set('clientId', String(id))
}
