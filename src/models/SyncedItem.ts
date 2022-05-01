import BaseModel from './BaseModel'
class SyncedItem extends BaseModel {
    static tableName = () => 'SyncedItem'

    // ({syncTarget, type_: item.type_, itemId: item.id, syncedAt})
    static getSyncedTargets (id) {
      return this.getByAttrWithValue('itemId', id).map(x => x.syncTarget)
    }

    static getLastSyncedTime (syncTarget, id) {
      const result = this.getByAttrWithValue('itemId', id)
        .filter(x => x.syncTarget === syncTarget)
      if (result.length) {
        return result[0].syncedAt
      }
      return null
    }
}

export default SyncedItem
