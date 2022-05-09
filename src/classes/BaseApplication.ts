
import { Store } from '@reduxjs/toolkit'
import Database from '../lib/Database'
import Logger from '../lib/Logger'
import store from '../lib/store'
import { envFromArgs } from '../lib/startupHelpers'
import Account from '../models/Account'
import BaseItem from '../models/BaseItem'
import BaseModel from '../models/BaseModel'
import Category from '../models/Category'
import CategoryGroup from '../models/CategoryGroup'
import Setting from '../models/Setting'
import Target from '../models/Target'
import Transaction from '../models/Transaction'
import Transfer from '../models/Transfer'
import BaseService from '../services/BaseService'
import StoicError from '../lib/StoicError'
import { toSystemSlashes } from '../utils/pathUtils'

const os = require('os')
const fs = require('fs-extra')

export default class BaseApplication {
    private database_: any = null;
    protected store_: Store<any> | null = null;

    public async start (argv: string[]): Promise<any> {
      // // That's not good, but it's to avoid circular dependency issues
      // // in the BaseItem class.
      BaseItem.loadClass('Account', Account)
      BaseItem.loadClass('Category', Category)
      BaseItem.loadClass('CategoryGroup', CategoryGroup)
      BaseItem.loadClass('Target', Target)
      BaseItem.loadClass('Transaction', Transaction)
      BaseItem.loadClass('Transfer', Transfer)

      const env = envFromArgs(argv)
      const profilePath = this.determineProfileDir(argv)
      // const debugMode = isDebugMode(argv)

      const tempDir = `${profilePath}/tmp`
      const cacheDir = `${profilePath}/cache`

      Setting.setConstant('env', env)
      Setting.setConstant('profileDir', profilePath)
      Setting.setConstant('tempDir', tempDir)
      Setting.setConstant('cacheDir', cacheDir)

      await fs.mkdirp(profilePath, 0o755)
      await fs.mkdirp(tempDir, 0o755)
      await fs.mkdirp(cacheDir, 0o755)

      const globalLogger = new Logger()
      BaseService.logger_ = globalLogger

      this.database_ = new Database(globalLogger)
      this.database_.setLogger(globalLogger)

      BaseModel.setDb(this.database_)

      if (Setting.get('firstStart')) {
        if (Setting.get('env') === 'dev') {
          Setting.set('showTrayIcon', '0')
          Setting.set('autoUpdateEnabled', '0')
          Setting.set('sync.interval', '3600')
        }

        Setting.set('sync.target', '0')
        Setting.set('firstStart', '0')
      }

      return argv
    }

    public store () {
      if (this.store_) return this.store_
      throw new StoicError('Store not initialized')
    }

    public dispatch (action: any) {
      const store = this.store()
      if (store) return store.dispatch(action)
    }

    public determineProfileDir (initArgs: any) {
      let output = ''

      if (initArgs.profileDir) {
        output = initArgs.profileDir
      } else if (process && process.env && process.env.PORTABLE_EXECUTABLE_DIR) {
        output = `${process.env.PORTABLE_EXECUTABLE_DIR}/JoplinProfile`
      } else {
        output = `${os.homedir()}/.config/${Setting.get('appName')}`
      }

      return toSystemSlashes(output, 'linux')
    }

    public initRedux () {
      this.store_ = store
      if (store) {
        BaseModel.dispatch = store.dispatch
      }
    }
}
