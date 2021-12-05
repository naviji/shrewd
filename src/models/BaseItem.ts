// import { ModelType } from '../BaseModel';
// import { BaseItemEntity, NoteEntity } from '../services/database/types';
// import Setting from './Setting';
// import BaseModel from '../BaseModel';
// import time from '../time';
// import markdownUtils from '../markdownUtils';
// import { _ } from '../locale';
// import Database from '../database';
// import ItemChange from './ItemChange';
// import ShareService from '../services/share/ShareService';
// import itemCanBeEncrypted from './utils/itemCanBeEncrypted';
// import { getEncryptionEnabled } from '../services/synchronizer/syncInfoUtils';
// const stoicError = require('../stoicError.js');
// const { sprintf } = require('sprintf-js');
// const moment = require('moment');
// import moment from 'moment'	
import { BaseItemEntity } from '../lib/types';
import timeUtils from '../utils/timeUtils';

import BaseModel, { ModelType } from "./BaseModel";
import DeletedItem from "./DeletedItem";
import SyncedItem from './SyncedItem';

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

	static fieldTypes() {
        return {}
    }

	static add(o) {
		return super.save(o)
	}

	// public static SYNC_ITEM_LOCATION_LOCAL = 1;
	// public static SYNC_ITEM_LOCATION_REMOTE = 2;


	// static useUuid() {
	// 	return true;
	// }

	// static encryptionSupported() {
	// 	return true;
	// }



	// static async findUniqueItemTitle(title: string, parentId: string = null) {
	// 	let counter = 1;
	// 	let titleToTry = title;
	// 	while (true) {
	// 		let item = null;

	// 		if (parentId !== null) {
	// 			item = await this.loadByFields({
	// 				title: titleToTry,
	// 				parent_id: parentId,
	// 			});
	// 		} else {
	// 			item = await this.loadByField('title', titleToTry);
	// 		}

	// 		if (!item) return titleToTry;
	// 		titleToTry = `${title} (${counter})`;
	// 		counter++;
	// 		if (counter >= 100) titleToTry = `${title} (${new Date().getTime()})`;
	// 		if (counter >= 1000) throw new Error('Cannot find unique title');
	// 	}
	// }



	// 	throw new Error(`Invalid class name: ${name}`);
	// }

	// static getClassByItemType(itemType: ModelType) {
	// 	for (let i = 0; i < BaseItem.syncItemDefinitions_.length; i++) {
	// 		if (BaseItem.syncItemDefinitions_[i].type == itemType) {
	// 			return BaseItem.syncItemDefinitions_[i].classRef;
	// 		}
	// 	}

	// 	throw new Error(`Invalid item type: ${itemType}`);
	// }

	// static async syncedCount(syncTarget: number) {
	// 	const ItemClass = this.itemClass(this.modelType());
	// 	const itemType = ItemClass.modelType();
	// 	// The fact that we don't check if the item_id still exist in the corresponding item table, means
	// 	// that the returned number might be innaccurate (for example if a sync operation was cancelled)
	// 	const sql = 'SELECT count(*) as total FROM sync_items WHERE sync_target = ? AND item_type = ?';
	// 	const r = await this.db().selectOne(sql, [syncTarget, itemType]);
	// 	return r.total;
	// }

    public static systemPath(itemOrId: any, extension: string = 'md') {
		if (typeof itemOrId === 'string') return `${itemOrId}.${extension}`;
		else return `${itemOrId.id}.${extension}`;
	}

	// static isSystemPath(path: string) {
	// 	// 1b175bb38bba47baac22b0b47f778113.md
	// 	if (!path || !path.length) return false;
	// 	let p: any = path.split('/');
	// 	p = p[p.length - 1];
	// 	p = p.split('.');
	// 	if (p.length != 2) return false;
	// 	return p[0].length == 32 && p[1] == 'md';
	// }

    static loadClass(className: string, classRef: any) {
		for (let i = 0; i < BaseItem.syncItemDefinitions_.length; i++) {
			if (BaseItem.syncItemDefinitions_[i].className == className) {
				BaseItem.syncItemDefinitions_[i].classRef = classRef;
				return;
			}
		}
		throw new Error(`Invalid class name: ${className}`);
	}

    // Need to dynamically load the classes like this to avoid circular dependencies
	static getClass(name: string) {
		for (let i = 0; i < BaseItem.syncItemDefinitions_.length; i++) {
			if (BaseItem.syncItemDefinitions_[i].className == name) {
				const classRef = BaseItem.syncItemDefinitions_[i].classRef;
				if (!classRef) throw new Error(`Class has not been loaded: ${name}`);
				return BaseItem.syncItemDefinitions_[i].classRef;
			}
		}
    }

	static getTypeFromClass(name: string) {
		for (let i = 0; i < BaseItem.syncItemDefinitions_.length; i++) {
			if (BaseItem.syncItemDefinitions_[i].className == name) {
				return BaseItem.syncItemDefinitions_[i].type;
			}
		}
	}

	static itemClass(item: any): any {
		if (!item) throw new Error('Item cannot be null');

		if (typeof item === 'object') {
			if (!('type_' in item)) throw new Error('Item does not have a type_ property');
			return this.itemClass(item.type_);
		} else {
			for (let i = 0; i < BaseItem.syncItemDefinitions_.length; i++) {
				const d = BaseItem.syncItemDefinitions_[i];
				if (Number(item) == d.type) return this.getClass(d.className);
			}
			throw new Error(`Unknown type: ${item}`);
		}
	}

	static convertToOriginalType(propName: string, propValue: any) {
        return this.fieldTypes()[propName] ? this.fieldTypes()[propName](propValue) : propValue
    }

	// // Returns the IDs of the items that have been synced at least once
	// static async syncedItemIds(syncTarget: number) {
	// 	if (!syncTarget) throw new Error('No syncTarget specified');
	// 	const temp = await this.db().selectAll('SELECT item_id FROM sync_items WHERE sync_time > 0 AND sync_target = ?', [syncTarget]);
	// 	const output = [];
	// 	for (let i = 0; i < temp.length; i++) {
	// 		output.push(temp[i].item_id);
	// 	}
	// 	return output;
	// }

	// static async allSyncItems(syncTarget: number) {
	// 	const output = await this.db().selectAll('SELECT * FROM sync_items WHERE sync_target = ?', [syncTarget]);
	// 	return output;
	// }

	// static pathToId(path: string) {
	// 	const p = path.split('/');
	// 	const s = p[p.length - 1].split('.');
	// 	let name: any = s[0];
	// 	if (!name) return name;
	// 	name = name.split('-');
	// 	return name[name.length - 1];
	// }

	// static loadItemByPath(path: string) {
	// 	return this.loadItemById(this.pathToId(path));
	// }

	// static async loadItemById(id: string) {
	// 	const classes = this.syncItemClassNames();
	// 	for (let i = 0; i < classes.length; i++) {
	// 		const item = await this.getClass(classes[i]).load(id);
	// 		if (item) return item;
	// 	}
	// 	return null;
	// }

	// static async loadItemsByIds(ids: string[]) {
	// 	if (!ids.length) return [];

	// 	const classes = this.syncItemClassNames();
	// 	let output: any[] = [];
	// 	for (let i = 0; i < classes.length; i++) {
	// 		const ItemClass = this.getClass(classes[i]);
	// 		const sql = `SELECT * FROM ${ItemClass.tableName()} WHERE id IN ("${ids.join('","')}")`;
	// 		const models = await ItemClass.modelSelectAll(sql);
	// 		output = output.concat(models);
	// 	}
	// 	return output;
	// }

	// static loadItemByField(itemType: number, field: string, value: any) {
	// 	const ItemClass = this.itemClass(itemType);
	// 	return ItemClass.loadByField(field, value);
	// }

	// static loadItem(itemType: ModelType, id: string) {
	// 	const ItemClass = this.itemClass(itemType);
	// 	return ItemClass.load(id);
	// }

	// static deleteItem(itemType: ModelType, id: string) {
	// 	const ItemClass = this.itemClass(itemType);
	// 	return ItemClass.delete(id);
	// }

	// static async delete(id: string, options: any = null) {
	// 	return this.batchDelete([id], options);
	// }

	// static async batchDelete(ids: string[], options: any = null) {
	// 	if (!options) options = {};
	// 	let trackDeleted = true;
	// 	if (options && options.trackDeleted !== null && options.trackDeleted !== undefined) trackDeleted = options.trackDeleted;

	// 	// Don't create a deleted_items entry when conflicted notes are deleted
	// 	// since no other client have (or should have) them.
	// 	let conflictNoteIds: string[] = [];
	// 	if (this.modelType() == BaseModel.TYPE_NOTE) {
	// 		const conflictNotes = await this.db().selectAll(`SELECT id FROM notes WHERE id IN ("${ids.join('","')}") AND is_conflict = 1`);
	// 		conflictNoteIds = conflictNotes.map((n: NoteEntity) => {
	// 			return n.id;
	// 		});
	// 	}

	// 	await super.batchDelete(ids, options);

	// 	if (trackDeleted) {
	// 		const syncTargetIds = Setting.enumOptionValues('sync.target');
	// 		const queries = [];
	// 		const now = time.unixMs();
	// 		for (let i = 0; i < ids.length; i++) {
	// 			if (conflictNoteIds.indexOf(ids[i]) >= 0) continue;

	// 			// For each deleted item, for each sync target, we need to add an entry in deleted_items.
	// 			// That way, each target can later delete the remote item.
	// 			for (let j = 0; j < syncTargetIds.length; j++) {
	// 				queries.push({
	// 					sql: 'INSERT INTO deleted_items (item_type, item_id, deleted_time, sync_target) VALUES (?, ?, ?, ?)',
	// 					params: [this.modelType(), ids[i], now, syncTargetIds[j]],
	// 				});
	// 			}
	// 		}
	// 		await this.db().transactionExecBatch(queries);
	// 	}
	// }

	// // Note: Currently, once a deleted_items entry has been processed, it is removed from the database. In practice it means that
	// // the following case will not work as expected:
	// // - Client 1 creates a note and sync with target 1 and 2
	// // - Client 2 sync with target 1
	// // - Client 2 deletes note and sync with target 1
	// // - Client 1 syncs with target 1 only (note is deleted from local machine, as expected)
	// // - Client 1 syncs with target 2 only => the note is *not* deleted from target 2 because no information
	// //   that it was previously deleted exist (deleted_items entry has been deleted).
	// // The solution would be to permanently store the list of deleted items on each client.
	static deletedItems(syncTarget: number) {
		return DeletedItem.getByAttrWithValue('syncTarget', syncTarget)
	}

	// static async deletedItemCount(syncTarget: number) {
	// 	const r = await this.db().selectOne('SELECT count(*) as total FROM deleted_items WHERE sync_target = ?', [syncTarget]);
	// 	return r['total'];
	// }

	static remoteDeletedItem(syncTarget: number, itemId: string) {
		DeletedItem.deleteByAttrMap({ syncTarget, itemId })
	}

	static async unserialize(content: string) {
		const lines = content.split('\n');
		let output: any = {};

		for (let i = lines.length - 1; i >= 0; i--) {
			let line = lines[i].trim();
			const p = line.indexOf(':');
			if (p < 0) throw new Error(`Invalid property format: ${line}: ${content}`);
			const key = line.substr(0, p).trim();
			const value = line.substr(p + 1).trim();
			output[key] = value;
		}

		if (!output.type_) throw new Error(`Missing required property: type_: ${content}`);
		output.type_ = Number(output.type_);

		const ItemClass = this.itemClass(output.type_);
		output = ItemClass.removeUnknownFields(output);

		for (const n in output) {
			if (!output.hasOwnProperty(n)) continue;
			output[n] = await this.unserialize_format(output.type_, n, output[n]);
		}

		return output;
	}

	// static convertToOriginalType(propName: string, propValue: any) {
	// 	return propValue
	// }


	static unserialize_format(type: ModelType, propName: string, propValue: any) {
		if (propName[propName.length - 1] == '_') return propValue; // Private property

		const ItemClass = this.itemClass(type);
		propValue = ItemClass.convertToOriginalType(propName, propValue)

		if (['updatedAt', 'createdAt'].indexOf(propName) >= 0) {
			propValue = (!propValue) ? 0 : Number(propValue)
		}
		return propValue
	}

	static async serialize(item: any, shownKeys: any[] = null) {

		// console.log('to serialize', item)

		if (shownKeys === null) {
			shownKeys = this.itemClass(item).fieldNames();
			shownKeys.push('type_');
		}

		const output = []

		for (let i = 0; i < shownKeys.length; i++) {
			const key = shownKeys[i];
			const value = this.serialize_format(key, item[key]);
			output.push(`${key}: ${value}`);
		}

		// console.log('serialized', output)

		return output.join('\n');
	}


	static serialize_format(propName: string, propValue: any) {
		// if (['date'].indexOf(propName) >= 0) {
		// 	if (!propValue) return '';
		// 	return timeUtils.serializeDate(propValue)
		// }
		return propValue
	}
	

	// public static async encryptedItemsStats(): Promise<EncryptedItemsStats> {
	// 	const classNames = this.encryptableItemClassNames();
	// 	let encryptedCount = 0;
	// 	let totalCount = 0;

	// 	for (let i = 0; i < classNames.length; i++) {
	// 		const ItemClass = this.getClass(classNames[i]);
	// 		encryptedCount += await ItemClass.count({ where: 'encryption_applied = 1' });
	// 		totalCount += await ItemClass.count();
	// 	}

	// 	return {
	// 		encrypted: encryptedCount,
	// 		total: totalCount,
	// 	};
	// }

	// static async encryptedItemsCount() {
	// 	const classNames = this.encryptableItemClassNames();
	// 	let output = 0;

	// 	for (let i = 0; i < classNames.length; i++) {
	// 		const className = classNames[i];
	// 		const ItemClass = this.getClass(className);
	// 		const count = await ItemClass.count({ where: 'encryption_applied = 1' });
	// 		output += count;
	// 	}

	// 	return output;
	// }

	// static async hasEncryptedItems() {
	// 	const classNames = this.encryptableItemClassNames();

	// 	for (let i = 0; i < classNames.length; i++) {
	// 		const className = classNames[i];
	// 		const ItemClass = this.getClass(className);

	// 		const count = await ItemClass.count({ where: 'encryption_applied = 1' });
	// 		if (count) return true;
	// 	}

	// 	return false;
	// }

	// static async itemsThatNeedDecryption(exclusions: string[] = [], limit = 100): Promise<ItemsThatNeedDecryptionResult> {
	// 	const classNames = this.encryptableItemClassNames();

	// 	for (let i = 0; i < classNames.length; i++) {
	// 		const className = classNames[i];
	// 		const ItemClass = this.getClass(className);

	// 		let whereSql = ['encryption_applied = 1'];

	// 		if (className === 'Resource') {
	// 			const blobDownloadedButEncryptedSql = 'encryption_blob_encrypted = 1 AND id IN (SELECT resource_id FROM resource_local_states WHERE fetch_status = 2))';
	// 			whereSql = [`(encryption_applied = 1 OR (${blobDownloadedButEncryptedSql})`];
	// 		}

	// 		if (exclusions.length) whereSql.push(`id NOT IN ("${exclusions.join('","')}")`);

	// 		const sql = sprintf(
	// 			`
	// 			SELECT *
	// 			FROM %s
	// 			WHERE %s
	// 			LIMIT %d
	// 			`,
	// 			this.db().escapeField(ItemClass.tableName()),
	// 			whereSql.join(' AND '),
	// 			limit
	// 		);

	// 		const items = await ItemClass.modelSelectAll(sql);

	// 		if (i >= classNames.length - 1) {
	// 			return { hasMore: items.length >= limit, items: items };
	// 		} else {
	// 			if (items.length) return { hasMore: true, items: items };
	// 		}
	// 	}

	// 	throw new Error('Unreachable');
	// }

	public static neverSyncedItems(syncTarget, limit) {		
		const result = this.getAll().filter(x => {
			const syncedTargets = SyncedItem.getSyncedTargets(x.id)
			return !syncedTargets.includes(syncTarget)
		}).map(x => Object.assign(x, {type_ : this.getTypeFromClass(this.tableName())}))
		result.length  = result.length > limit ? limit: result.length
		return result
	}

	public static changedItems(syncTarget, limit) {
		const result = this.getAll().filter(x => {
			const syncedTargets = SyncedItem.getSyncedTargets(x.id)
			const lastSyncedAt = SyncedItem.getLastSyncedTime(syncTarget, x.id) 
			return syncedTargets.includes(syncTarget) && lastSyncedAt < x.updatedAt
		}).map(x => Object.assign(x, {type_ : this.getTypeFromClass(this.tableName())}))

		result.length  = result.length > limit ? limit: result.length
		return result
		// .map(x => Object.assign({}, x, { syncTime: x.syncTimes[syncTarget]}))
	}

	// public static async itemHasBeenSynced(itemId: string): Promise<boolean> {
	// 	const r = await this.db().selectOne('SELECT item_id FROM sync_items WHERE item_id = ?', [itemId]);
	// 	return !!r;
	// }

	public static async itemsThatNeedSync(syncTarget: number, limit = 100): Promise<ItemsThatNeedSyncResult> {
		
		const classNames = this.syncItemClassNames()

		for (let i = 0; i < classNames.length; i++) {
			const className = classNames[i];
			const ItemClass = this.getClass(className);
			// TODO: Sort by descending updated time
			const neverSyncedItems = await ItemClass.neverSyncedItems(syncTarget, limit);
			const newLimit = limit - neverSyncedItems.length;
			const changedItems = await ItemClass.changedItems(syncTarget, newLimit)

			const neverSyncedItemIds = neverSyncedItems.map((it: any) => it.id);
			const items = neverSyncedItems.concat(changedItems);

			if (i >= classNames.length - 1) {
				return { hasMore: items.length >= limit, items: items, neverSyncedItemIds };
			} else {
				if (items.length) return { hasMore: true, items: items, neverSyncedItemIds };
			}
		}

		throw new Error('Unreachable');
	}

	static syncItemClassNames(): string[] {
		return BaseItem.syncItemDefinitions_.map((def: any) => {
			return def.className;
		});
	}


	public static async serializeForSync(item: BaseItemEntity): Promise<string> {
		const ItemClass = this.itemClass(item);
		const shownKeys = ItemClass.fieldNames();
		shownKeys.push('type_');

		return ItemClass.serialize(item, shownKeys);
	}

	static async saveSyncTime(syncTarget: number, item: any, syncedAt: number) {
		return SyncedItem.save({syncTarget, type_: item.type_, itemId: item.id, syncedAt})
	}

	// Returns the IDs of the items that have been synced at least once
	static async syncedItemIds(syncTarget: number) {
		if (!syncTarget) throw new Error('No syncTarget specified');
		return SyncedItem.getByAttrWithValue('syncTarget', syncTarget).map(x => x.itemId)
	}
	
	static pathToId(path: string) {
		const p = path.split('/');
		const s = p[p.length - 1].split('.');
		let name: any = s[0];
		if (!name) return name;
		name = name.split('-');
		return name[name.length - 1];
	}

	static async loadItemsByIds(ids: string[]) {
		if (!ids.length) return [];

		const classes = this.syncItemClassNames();
		let output: any[] = [];
		for (let i = 0; i < classes.length; i++) {
			const ItemClass = this.getClass(classes[i]);
			output = output.concat(ItemClass.getAll().filter(x => ids.indexOf(x.id) > -1))
		}
		return output;
	}

	static isSystemPath(path: string) {
		// 1b175bb38bba47baac22b0b47f778113.md
		if (!path || !path.length) return false;
		let p: any = path.split('/');
		p = p[p.length - 1];
		p = p.split('.');
		if (p.length != 2) return false;
		// return p[0].length == 32 && p[1] == 'md'; TODO: convert Ids to UUID
		return p[1] === 'md';
	}

}
