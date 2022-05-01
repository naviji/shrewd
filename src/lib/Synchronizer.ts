import ItemUploader from './ItemUploader'
import BaseItem from '../models/BaseItem'
import { Dirnames } from './types'
import timeUtils from '../utils/timeUtils'
import syncInfoUtils from '../utils/syncInfoUtils'
import Logger from './Logger'
import Database from './Database'
import FileApi from './FileApi'
import LockHandler from './LockHandler'
import Setting from '../models/Setting'
import TaskQueue from './TaskQueue'
import SyncedItem from '../models/SyncedItem'
import MigrationHandler from './MigrationHandler'
const { sprintf } = require('sprintf-js')

interface RemoteItem {
    id: string;
    path?: string;
    type_?: number;
    isDeleted?: boolean;

    // This the time when the file was created on the server. It is used for
    // example for the locking mechanim or any file that's not an actual stoic
    // item.
    updatedAt?: number;

    // This is the time that corresponds to the actual stoic item updatedAt
    // value. A note is always uploaded with a delay so the server updatedAt
    // value will always be ahead. However for synchronising we need to know the
    // exact stoic item updatedAt value.
    app_updatedAt?: number;
}

export default class Synchronizer {
  // public static verboseMode: boolean = true;

    private db_: Database;
    private api_: FileApi;
    private appType_: string;
    private logger_: Logger = new Logger();
    private state_: string = 'idle';
    private cancelling_: boolean = false;
    public maxResourceSize_: number = null;
    private downloadQueue_: any = null;
    private clientId_: string;
    private lockHandler_: LockHandler;
    private migrationHandler_: MigrationHandler;
    private syncTargetIsLocked_: boolean = false;

    // Debug flags are used to test certain hard-to-test conditions
    // such as cancelling in the middle of a loop.
    public testingHooks_: string[] = [];

    private onProgress_: Function;
    private progressReport_: any = {};

    // public dispatch: Function;

    public constructor (db: Database, api: FileApi, appType: string) {
      this.db_ = db
      this.api_ = api

      this.appType_ = appType
      this.clientId_ = Setting.get('clientId')
      this.logger_ = new Logger()

      // this.onProgress_ = function() {};
      // this.progressReport_ = {};

      // this.dispatch = function() {};

      this.apiCall = this.apiCall.bind(this)
    }

    state () {
      return this.state_
    }

    db () {
      return this.db_
    }

    api () {
      return this.api_
    }

    clientId () {
      return this.clientId_
    }

    setLogger (l: Logger) {
      this.logger_ = l
    }

    logger () {
      return this.logger_
    }

    lockHandler () {
      if (this.lockHandler_) return this.lockHandler_
      this.lockHandler_ = new LockHandler(this.api())
      return this.lockHandler_
    }

    migrationHandler () {
      if (this.migrationHandler_) return this.migrationHandler_
      this.migrationHandler_ = new MigrationHandler(this.api(), this.db(), this.lockHandler(), this.appType_, this.clientId_)
      return this.migrationHandler_
    }

    cancel () {
      if (this.cancelling_ || this.state() == 'idle') return

      // Stop queue but don't set it to null as it may be used to
      // retrieve the last few downloads.
      // if (this.downloadQueue_) this.downloadQueue_.stop();

      this.logger().info('Cancelling sync')

      this.cancelling_ = true
    }

    cancelling () {
      return this.cancelling_
    }

    async lockErrorStatus_ () {
      const hasActiveSyncLock = await this.lockHandler().hasActiveLock(this.appType_, this.clientId_)
      if (!hasActiveSyncLock) return 'syncLockGone'

      return ''
    }

    private async apiCall (fnName: string, ...args: any[]) {
      if (this.syncTargetIsLocked_) throw new Error('Sync target is locked - aborting API call')

      try {
        const output = await (this.api() as any)[fnName](...args)
        return output
      } catch (error) {
        const lockStatus = await this.lockErrorStatus_()
        // When there's an error due to a lock, we re-wrap the error and change the error code so that error handling
        // does not do special processing on the original error. For example, if a resource could not be downloaded,
        // don't mark it as a "cannotSyncItem" since we don't know that.
        if (lockStatus) {
          throw new Error(`Sync target lock error: ${lockStatus}. Original error was: ${error.message}`)
        } else {
          throw error
        }
      }
    }

    // Synchronisation is done in three major steps:
    //
    // 1. UPLOAD: Send to the sync target the items that have changed since the last sync.
    // 2. DELETE_REMOTE: Delete on the sync target, the items that have been deleted locally.
    // 3. DELTA: Find on the sync target the items that have been modified or deleted and apply the changes locally.
    public async start (options: any = null) {
      if (!options) options = {}

      if (this.state() != 'idle') {
        const error: any = new Error(sprintf('Synchronisation is already in progress. State: %s', this.state()))
        error.code = 'alreadyStarted'
        throw error
      }

      this.state_ = 'in_progress'

      const lastContext = options.context ? options.context : {}

      const syncSteps = options.syncSteps ? options.syncSteps : ['update_remote', 'delete_remote', 'delta']

      // The default is to log errors, but when testing it's convenient to be able to catch and verify errors
      const throwOnError = options.throwOnError === true

      const syncTargetId = this.api().syncTargetId()

      this.syncTargetIsLocked_ = false
      this.cancelling_ = false

      // const masterKeysBefore = await MasterKey.count();
      // let hasAutoEnabledEncryption = false;

      // TODO: Rename timeInUnixMs to currTimeInUnixMs()
      const synchronizationId = timeUtils.timeInUnixMs() // TODO: change to etags?

      const outputContext = Object.assign({}, lastContext)

      this.progressReport_.startTime = timeUtils.timeInUnixMs()

      this.logger().info(`Starting synchronisation to target ${syncTargetId}`)

      const itemUploader = new ItemUploader(this.api(), this.apiCall)

      let errorToThrow = null
      let syncLock = null

      try {
        await this.api().initialize()
        this.api().setTempDirName(Dirnames.Temp)

        try {
          let remoteInfo = await syncInfoUtils.fetchSyncInfo(this.api())
          this.logger().info(`Sync target remote info: ${remoteInfo}`)
          this.logger().info(`Setting.get('syncVersion') = ${Setting.get('syncVersion')}`)

          if (!remoteInfo.version) {
            this.logger().info('Sync target is new - setting it up...')
            await this.migrationHandler().upgrade(Setting.get('syncVersion'))
            remoteInfo = await syncInfoUtils.fetchSyncInfo(this.api())
          }

          this.logger().info('Sync target is already setup - checking it...')

          await this.migrationHandler().checkCanSync(remoteInfo)

          const localInfo = syncInfoUtils.localSyncInfo()

          this.logger().info(`Sync target local info: ${JSON.stringify(localInfo)}`)
        } catch (error) {
          this.logger().info(error)
          // if (error.code === 'outdatedSyncTarget') {
          // 	Setting.set('sync.upgradeState', Setting.SYNC_UPGRADE_STATE_SHOULD_DO);
          // }
          throw error
        }

        syncLock = await this.lockHandler().acquireLock(this.appType_, this.clientId_)

        this.lockHandler().startAutoLockRefresh(syncLock, (error: any) => {
          this.logger().warn(`Could not refresh lock - cancelling sync. Error was: ${error}`)
          this.syncTargetIsLocked_ = true
          this.cancel()
        })

        // ========================================================================
        // 1. DELETE_REMOTE
        // ------------------------------------------------------------------------
        // Delete the remote items that have been deleted locally.
        // ========================================================================

        if (syncSteps.indexOf('delete_remote') >= 0) {
          const deletedItems = await BaseItem.deletedItems(syncTargetId)
          for (let i = 0; i < deletedItems.length; i++) {
            if (this.cancelling()) break

            const item = deletedItems[i]
            const path = BaseItem.systemPath(item.item_id)
            this.logger().info(`deleteRemote ${JSON.stringify({ id: item.item_id })} local has been deleted`)
            await this.apiCall('delete', path)

            await BaseItem.remoteDeletedItem(syncTargetId, item.item_id)
          }
        } // DELETE_REMOTE STEP

        // ========================================================================
        // 2. UPLOAD
        // ------------------------------------------------------------------------
        // First, find all the items that have been changed since the
        // last sync and apply the changes to remote.
        // ========================================================================

        if (syncSteps.indexOf('update_remote') >= 0) {
          const donePaths: string[] = []

          const completeItemProcessing = (path: string) => {
            donePaths.push(path)
          }

          while (true) {
            if (this.cancelling()) break

            const result = await BaseItem.itemsThatNeedSync(syncTargetId)
            const locals = result.items

            for (let i = 0; i < locals.length; i++) {
              if (this.cancelling()) break

              const local = locals[i]
              const ItemClass = BaseItem.itemClass(local)
              const path = BaseItem.systemPath(local)

              // Safety check to avoid infinite loops.
              // - In fact this error is possible if the item is marked for sync (via sync_time or force_sync) while synchronisation is in
              //   progress. In that case exit anyway to be sure we aren't in a loop and the item will be re-synced next time.
              // - It can also happen if the item is directly modified in the sync target, and set with an update_time in the future. In that case,
              //   the local sync_time will be updated to Date.now() but on the next loop it will see that the remote item still has a date ahead
              //   and will see a conflict. There's currently no automatic fix for this - the remote item on the sync target must be fixed manually
              //   (by setting an updatedAt less than current time).
              if (donePaths.indexOf(path) >= 0) throw new Error('Processing a path that has already been done: %s. sync_time was not updated? Remote item has an updatedAt in the future?\', path), \'processingPathTwice')

              const remote: RemoteItem = result.neverSyncedItemIds.includes(local.id) ? null : await this.apiCall('stat', path)
              let action = null

              let reason = ''
              let remoteContent = null

              if (!remote) {
                if (!local.syncedAt) {
                  action = 'createRemote'
                  reason = 'remote does not exist, and local is new and has never been synced'
                } else {
                  // Item was modified after having been deleted remotely
                  // Conflict items are not created;
                  // No action in UPLOAD step; but item will be delted in DELTA step
                  action = 'noop'
                  reason = 'remote has been deleted, but local has changes'
                }
              } else {
                // Note: in order to know the real updatedAt value, we need to load the content. In theory we could
                // rely on the file timestamp (in remote.updatedAt) but in practice it's not accurate enough and
                // can lead to conflicts (for example when the file timestamp is slightly ahead of it's real
                // updatedAt). updatedAt is set and managed by clients so it's always accurate.
                // Same situation below for updateLocal.
                //
                // This is a bit inefficient because if the resulting action is "updateRemote" we don't need the whole
                // content, but for now that will do since being reliable is the priority.
                //
                // Note: assuming a particular sync target is guaranteed to have accurate timestamps, the driver maybe
                // could expose this with a accurateTimestamps() method that returns "true". In that case, the test
                // could be done using the file timestamp and the potentially unnecessary content loading could be skipped.
                // OneDrive does not appear to have accurate timestamps as lastModifiedDateTime would occasionally be
                // a few seconds ahead of what it was set with setTimestamp()
                try {
                  remoteContent = await this.apiCall('get', path)
                } catch (error) {
                  if (error.code === 'rejectedByTarget') {
                    // TO DO
                    // this.progressReport_.errors.push(error);
                    // this.logger().warn(`Rejected by target: ${path}: ${error.message}`);
                    // completeItemProcessing(path);
                    continue
                  } else {
                    throw error
                  }
                }
                if (!remoteContent) throw new Error(`Got metadata for path but could not fetch content: ${path}`)
                remoteContent = await BaseItem.unserialize(remoteContent)

                if (remoteContent.updatedAt > local.syncedAt) {
                  // Since, in this loop, we are only dealing with items that require sync, if the
                  // remote has been modified after the sync time, it means both items have been
                  // modified and so there's a conflict.
                  if (remoteContent.updatedAt > local.updatedAt) {
                    action = 'updateLocal'
                    reason = 'both remote and local have changes with remote having the latest update'
                  } else {
                    action = 'updateRemote'
                    reason = 'both remote and local have changes with local having the latest update'
                  }
                } else {
                  action = 'updateRemote'
                  reason = 'local has changes'
                }
              }

              if (action === 'createRemote' || action === 'updateRemote') {
                const canSync = true
                await itemUploader.serializeAndUploadItem(ItemClass, path, local)

                if (canSync) {
                  await ItemClass.saveSyncTime(syncTargetId, local, local.updatedAt)
                }
              }

              completeItemProcessing(path)
            }

            if (!result.hasMore) break
          }
        } // UPLOAD STEP

        // ------------------------------------------------------------------------
        // 3. DELTA
        // ------------------------------------------------------------------------
        // Loop through all the remote items, find those that
        // have been created or updated, and apply the changes to local.
        // ------------------------------------------------------------------------

        if (this.downloadQueue_) await this.downloadQueue_.stop()
        this.downloadQueue_ = new TaskQueue('syncDownload')
        this.downloadQueue_.logger_ = this.logger()

        if (syncSteps.indexOf('delta') >= 0) {
          // At this point all the local items that have changed have been pushed to remote
          // or handled as conflicts, so no conflict is possible after this.

          let context = null
          let newDeltaContext = null
          const localFoldersToDelete = []
          let hasCancelled = false
          if (lastContext.delta) context = lastContext.delta

          while (true) {
            if (this.cancelling() || hasCancelled) break

            const listResult: any = await this.apiCall('delta', '', {
              context: context,

              // allItemIdsHandler() provides a way for drivers that don't have a delta API to
              // still provide delta functionality by comparing the items they have to the items
              // the client has. Very inefficient but that's the only possible workaround.
              // It's a function so that it is only called if the driver needs these IDs. For
              // drivers with a delta functionality it's a noop.
              allItemIdsHandler: async () => {
                return BaseItem.syncedItemIds(syncTargetId)
              },
              logger: this.logger()
            })

            // TODO: DEBUG: Check why this is getting undefined.md
            const remotes: RemoteItem[] = listResult.items

            const remoteIds = remotes.map(r => BaseItem.pathToId(r.path))
            const locals = await BaseItem.loadItemsByIds(remoteIds)

            for (const remote of remotes) {
              if (this.cancelling()) break

              // TODO: Find a way to download only a part of the file
              // using streams to get the updated time(which is kept at the start)
              this.downloadQueue_.push(remote.path, async () => {
                return this.apiCall('get', remote.path)
              })
            }

            for (let i = 0; i < remotes.length; i++) {
              if (this.cancelling()) {
                hasCancelled = true
                break
              }

              const remote = remotes[i]
              // The delta API might return things like the .sync, .resource or the root folder
              if (!BaseItem.isSystemPath(remote.path)) continue

              const loadContent = async () => {
                const task = await this.downloadQueue_.waitForResult(path)
                if (task.error) throw task.error
                if (!task.result) return null
                return await BaseItem.unserialize(task.result)
              }

              const path = remote.path
              const remoteId = BaseItem.pathToId(path)
              let action = null
              let reason = ''
              const local = locals.find(l => l.id == remoteId)
              let ItemClass = null
              let content = null

              if (!local) {
                if (remote.isDeleted !== true) {
                  action = 'createLocal'
                  reason = 'remote exists but local does not'
                  content = await loadContent()
                  ItemClass = content ? BaseItem.itemClass(content) : null
                }
              } else {
                ItemClass = BaseItem.itemClass(local)
                // local = ItemClass.filter(local);
                if (remote.isDeleted) {
                  action = 'deleteLocal'
                  reason = 'remote has been deleted'
                } else {
                  // TODO: Use streams to only load part of the content
                  content = await loadContent()
                  if (content && content.updatedAt > local.updatedAt) {
                    action = 'updateLocal'
                    reason = 'remote is more recent than local'
                  }
                }
              }

              if (!action) continue

              if (action === 'createLocal' || action === 'updateLocal') {
                if (content === null) {
                  this.logger().warn(`Remote has been deleted between now and the delta() call? In that case it will be handled during the next sync: ${path}`)
                  continue
                }
                // content = ItemClass.filter(content);

                // 2017-12-03: This was added because the new user_updatedAt and user_createdAt properties were added
                // to the items. However changing the database is not enough since remote items that haven't been synced yet
                // will not have these properties and, since they are required, it would cause a problem. So this check
                // if they are present and, if not, set them to a reasonable default.
                // Let's leave these two lines for 6 months, by which time all the clients should have been synced.
                // if (!content.user_updatedAt) content.user_updatedAt = content.updatedAt;
                // if (!content.user_createdAt) content.user_createdAt = content.createdAt;

                SyncedItem.save(content)

                await ItemClass.save(content, options)
              } else if (action == 'deleteLocal') {
                const ItemClass = BaseItem.itemClass(local.type_)
                await ItemClass.delete(local.id)
              }
            }

            // If user has cancelled, don't record the new context (2) so that synchronisation
            // can start again from the previous context (1) next time. It is ok if some items
            // have been synced between (1) and (2) because the loop above will handle the same
            // items being synced twice as an update. If the local and remote items are identical
            // the update will simply be skipped.
            if (!hasCancelled) {
              if (options.saveContextHandler) { // TODO: This is defined in the registry
                const deltaToSave = Object.assign({}, listResult.context)
                // Remove these two variables because they can be large and can be rebuilt
                // the next time the sync is started.
                delete deltaToSave.statsCache
                delete deltaToSave.statIdsCache
                options.saveContextHandler({ delta: deltaToSave })
              }

              if (!listResult.hasMore) {
                newDeltaContext = listResult.context
                break
              }
              context = listResult.context
            }
          }

          outputContext.delta = newDeltaContext || lastContext.delta
        } // DELTA STEP
      } catch (error) {
        if (throwOnError) {
          errorToThrow = error
        }
      }

      if (syncLock) {
        this.lockHandler().stopAutoLockRefresh(syncLock)
        await this.lockHandler().releaseLock(this.appType_, this.clientId_)
      }

      this.syncTargetIsLocked_ = false

      if (this.cancelling()) {
        this.logger().info('Synchronisation was cancelled.')
        this.cancelling_ = false
      }

      this.progressReport_.completedTime = timeUtils.timeInUnixMs()

      this.state_ = 'idle'

      if (errorToThrow) throw errorToThrow

      return outputContext
    }
}
