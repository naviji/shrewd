import Setting from '../models/Setting'
import BaseSyncTarget from './BaseSyncTarget'
import Synchronizer from './Synchronizer'

export default class SyncTargetFilesystem extends BaseSyncTarget {
  static id () {
    return 2
  }

  static targetName () {
    return 'filesystem'
  }

  static label () {
    return 'File system'
  }

  static unsupportedPlatforms () {
    return ['ios']
  }

  async isAuthenticated () {
    return true
  }

  async initSynchronizer () {
    return new Synchronizer(this.db(), await this.fileApi(), Setting.get('appType'))
  }
}
