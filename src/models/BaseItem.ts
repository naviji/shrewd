
import { BaseItemEntity } from '../lib/types'

import BaseModel, { ModelType } from './BaseModel'
import DeletedItem from './DeletedItem'
import SyncedItem from './SyncedItem'

export interface ItemsThatNeedDecryptionResult {
    hasMore: boolean;
    items: any[];
}

export interface ItemThatNeedSync {
    id: string;
    type_: ModelType
    syncedAt: number;
    updatedAt: number;
}

export interface ItemsThatNeedSyncResult {
    hasMore: boolean;
    items: ItemThatNeedSync[];
    neverSyncedItemIds: string[];
}

export interface EncryptedItemsStats {
    encrypted: number;
    total: number;
}

export default class BaseItem extends BaseModel {
  // Also update:
  // - itemsThatNeedSync()
  // - syncedItems()

    public static syncItemDefinitions_: any[] = [
      { type: BaseModel.TYPE_ACCOUNT, className: 'Account' },
      { type: BaseModel.TYPE_CATEGORY, className: 'Category' },
      { type: BaseModel.TYPE_CATEGORY_GROUP, className: 'CategoryGroup' },
      { type: BaseModel.TYPE_TARGET, className: 'Target' },
      { type: BaseModel.TYPE_TRANSACTION, className: 'Transaction' },
      { type: BaseModel.TYPE_TRANSFER, className: 'Transfer' }
    ];

    static fieldTypes (): { [index: string] : any} {
      return {}
    }

    static add (o: any) {
      return super.save(o)
    }

    public static systemPath (itemOrId: any, extension: string = 'md') {
      if (typeof itemOrId === 'string') return `${itemOrId}.${extension}`
      else return `${itemOrId.id}.${extension}`
    }

    static loadClass (className: string, classRef: any) {
      for (let i = 0; i < BaseItem.syncItemDefinitions_.length; i++) {
        if (BaseItem.syncItemDefinitions_[i].className === className) {
          BaseItem.syncItemDefinitions_[i].classRef = classRef
          return
        }
      }
      throw new Error(`Invalid class name: ${className}`)
    }

    // Need to dynamically load the classes like this to avoid circular dependencies
    static getClass (name: string) {
      for (let i = 0; i < BaseItem.syncItemDefinitions_.length; i++) {
        if (BaseItem.syncItemDefinitions_[i].className === name) {
          const classRef = BaseItem.syncItemDefinitions_[i].classRef
          if (!classRef) throw new Error(`Class has not been loaded: ${name}`)
          return BaseItem.syncItemDefinitions_[i].classRef
        }
      }
    }

    static getTypeFromClass (name: string) {
      for (let i = 0; i < BaseItem.syncItemDefinitions_.length; i++) {
        if (BaseItem.syncItemDefinitions_[i].className === name) {
          return BaseItem.syncItemDefinitions_[i].type
        }
      }
    }

    static itemClass (item: any): any {
      if (!item) throw new Error('Item cannot be null')

      if (typeof item === 'object') {
        if (!('type_' in item)) throw new Error('Item does not have a type_ property')
        return this.itemClass(item.type_)
      } else {
        for (let i = 0; i < BaseItem.syncItemDefinitions_.length; i++) {
          const d = BaseItem.syncItemDefinitions_[i]
          if (Number(item) === d.type) return this.getClass(d.className)
        }
        throw new Error(`Unknown type: ${item}`)
      }
    }

    static convertToOriginalType (propName: string, propValue: any) {
      return this.fieldTypes()[propName] ? this.fieldTypes()[propName](propValue) : propValue
    }

    // // Note: Currently, once a deleted_items entry has been processed, it is removed from the database. In practice it means that
    // // the following case will not work as expected:
    // // - Client 1 creates a note and sync with target 1 and 2
    // // - Client 2 sync with target 1
    // // - Client 2 deletes note and sync with target 1
    // // - Client 1 syncs with target 1 only (note is deleted from local machine, as expected)
    // // - Client 1 syncs with target 2 only => the note is *not* deleted from target 2 because no information
    // //   that it was previously deleted exist (deleted_items entry has been deleted).
    // // The solution would be to permanently store the list of deleted items on each client.
    static deletedItems (syncTarget: number) {
      return DeletedItem.getByAttrWithValue('syncTarget', syncTarget)
    }

    static remoteDeletedItem (syncTarget: number, itemId: string) {
      DeletedItem.deleteByAttrMap({ syncTarget, itemId })
    }

    static async unserialize (content: string) {
      const lines = content.split('\n')
      let output: any = {}

      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim()
        const p = line.indexOf(':')
        if (p < 0) throw new Error(`Invalid property format: ${line}: ${content}`)
        const key = line.substr(0, p).trim()
        const value = line.substr(p + 1).trim()
        output[key] = value
      }

      if (!output.type_) throw new Error(`Missing required property: type_: ${content}`)
      output.type_ = Number(output.type_)

      const ItemClass = this.itemClass(output.type_)
      output = ItemClass.removeUnknownFields(output)

      for (const n in output) {
        if (!Object.prototype.hasOwnProperty.call(output, n)) continue
        output[n] = await this.unserializeFormat(output.type_, n, output[n])
      }

      return output
    }

    static unserializeFormat (type: ModelType, propName: string, propValue: any) {
      if (propName[propName.length - 1] === '_') return propValue // Private property

      const ItemClass = this.itemClass(type)
      propValue = ItemClass.convertToOriginalType(propName, propValue)

      if (['updatedAt', 'createdAt'].indexOf(propName) >= 0) {
        propValue = (!propValue) ? 0 : Number(propValue)
      }
      return propValue
    }

    static async serialize (item: any, shownKeys: any[] | null = null) {
      // console.log('to serialize', item)

      if (shownKeys === null) {
        shownKeys = this.itemClass(item).fieldNames()
        shownKeys = ['type_']
      }

      const output = []

      for (let i = 0; i < shownKeys.length; i++) {
        const key = shownKeys[i]
        const value = this.serializeFormat(key, item[key])
        output.push(`${key}: ${value}`)
      }

      // console.log('serialized', output)

      return output.join('\n')
    }

    static serializeFormat (propName: string, propValue: any) {
      return propValue
    }

    public static neverSyncedItems (syncTarget, limit) {
      const result = this.getAll().filter(x => {
        const syncedTargets = SyncedItem.getSyncedTargets(x.id)
        return !syncedTargets.includes(syncTarget)
      }).map(x => Object.assign(x, { type_: this.getTypeFromClass(this.tableName()) }))
      result.length = result.length > limit ? limit : result.length
      return result
    }

    public static changedItems (syncTarget, limit) {
      const result = this.getAll().filter(x => {
        const syncedTargets = SyncedItem.getSyncedTargets(x.id)
        const lastSyncedAt = SyncedItem.getLastSyncedTime(syncTarget, x.id)
        return syncedTargets.includes(syncTarget) && lastSyncedAt < x.updatedAt
      }).map(x => Object.assign(x, { type_: this.getTypeFromClass(this.tableName()) }))

      result.length = result.length > limit ? limit : result.length
      return result
      // .map(x => Object.assign({}, x, { syncTime: x.syncTimes[syncTarget]}))
    }

    public static async itemsThatNeedSync (syncTarget: number, limit = 100): Promise<ItemsThatNeedSyncResult> {
      const classNames = this.syncItemClassNames()

      for (let i = 0; i < classNames.length; i++) {
        const className = classNames[i]
        const ItemClass = this.getClass(className)
        // TODO: Sort by descending updated time
        const neverSyncedItems = await ItemClass.neverSyncedItems(syncTarget, limit)
        const newLimit = limit - neverSyncedItems.length
        const changedItems = await ItemClass.changedItems(syncTarget, newLimit)

        const neverSyncedItemIds = neverSyncedItems.map((it: any) => it.id)
        const items = neverSyncedItems.concat(changedItems)

        if (i >= classNames.length - 1) {
          return { hasMore: items.length >= limit, items: items, neverSyncedItemIds }
        } else {
          if (items.length) return { hasMore: true, items: items, neverSyncedItemIds }
        }
      }

      throw new Error('Unreachable')
    }

    static syncItemClassNames (): string[] {
      return BaseItem.syncItemDefinitions_.map((def: any) => {
        return def.className
      })
    }

    public static async serializeForSync (item: BaseItemEntity): Promise<string> {
      const ItemClass = this.itemClass(item)
      const shownKeys = ItemClass.fieldNames()
      shownKeys.push('type_')

      return ItemClass.serialize(item, shownKeys)
    }

    static async saveSyncTime (syncTarget: number, item: any, syncedAt: number) {
      return SyncedItem.save({ syncTarget, type_: item.type_, itemId: item.id, syncedAt })
    }

    // Returns the IDs of the items that have been synced at least once
    static async syncedItemIds (syncTarget: number) {
      if (!syncTarget) throw new Error('No syncTarget specified')
      return SyncedItem.getByAttrWithValue('syncTarget', syncTarget).map(x => x.itemId)
    }

    static pathToId (path: string) {
      const p = path.split('/')
      const s = p[p.length - 1].split('.')
      let name: any = s[0]
      if (!name) return name
      name = name.split('-')
      return name[name.length - 1]
    }

    static async loadItemsByIds (ids: string[]) {
      if (!ids.length) return []

      const classes = this.syncItemClassNames()
      let output: any[] = []
      for (let i = 0; i < classes.length; i++) {
        const ItemClass = this.getClass(classes[i])
        output = output.concat(ItemClass.getAll().filter((x: {id: string}) => ids.indexOf(x.id) > -1))
      }
      return output
    }

    static isSystemPath (path: string) {
      // 1b175bb38bba47baac22b0b47f778113.md
      if (!path || !path.length) return false
      let p: any = path.split('/')
      p = p[p.length - 1]
      p = p.split('.')
      if (p.length !== 2) return false
      // return p[0].length == 32 && p[1] == 'md'; TODO: convert Ids to UUID
      return p[1] === 'md'
    }
}
