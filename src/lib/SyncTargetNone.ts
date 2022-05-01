// const BaseSyncTarget = require('./BaseSyncTarget').default;
import BaseSyncTarget from './BaseSyncTarget'
import FileApi from './FileApi'

export default class SyncTargetNone extends BaseSyncTarget {
  public static id () {
    return 0
  }

  public static targetName () {
    return 'none'
  }

  public static label () {
    return '(None)' // Add _ for translation
  }

  public async fileApi (): Promise<FileApi> {
    return null
  }

  protected async initFileApi () {

  }

  protected async initSynchronizer () {
    return null as any
  }
}
