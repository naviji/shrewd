// import LockHandler, { LockType } from './LockHandler';
// import { Dirnames } from './utils/types';
// import BaseService from '../BaseService';
// import migration1 from './migrations/1';
// import migration2 from './migrations/2';
// import migration3 from './migrations/3';
// import Setting from '../../models/Setting';
// import stoicError from '../../stoicError';
// import { FileApi } from '../../file-api';
// import stoicDatabase from '../../stoicDatabase';
// import { fetchSyncInfo, SyncInfo } from './syncInfoUtils';
// const { sprintf } = require('sprintf-js');

import FileApi from "./FileApi";
import Database from "./Database";
import LockHandler from "./LockHandler";
import Setting from "../models/Setting";
import BaseService from "../services/BaseService";

import migration1 from './migrations/1'
import syncInfoUtils, { SyncInfo } from "../utils/syncInfoUtils";
import { Dirnames } from "./types";

export type MigrationFunction = (api: FileApi, db: Database)=> Promise<void>;

// To add a new migration:
// - Add the migration logic in ./migrations/VERSION_NUM.js
// - Add the file to the array below.
// - Set Setting.syncVersion to VERSION_NUM in models/Setting.js
// - Add tests in synchronizer_migrationHandler
const migrations: MigrationFunction[] = [
	null,
	migration1
];

interface SyncTargetInfo {
	version: number;
}

export default class MigrationHandler extends BaseService {

	private api_: FileApi = null;
	private lockHandler_: LockHandler = null;
	private clientType_: string;
	private clientId_: string;
	private db_: Database;

	public constructor(api: FileApi, db: Database, lockHandler: LockHandler, clientType: string, clientId: string) {
		super();
		this.api_ = api;
		this.db_ = db;
		this.lockHandler_ = lockHandler;
		this.clientType_ = clientType;
		this.clientId_ = clientId;
	}

	// public async fetchSyncTargetInfo(): Promise<SyncTargetInfo> {
	// 	const syncTargetInfoText = await this.api_.get('info.json');

	// 	// Returns version 0 if the sync target is empty
	// 	let output: SyncTargetInfo = { version: 0 };

	// 	if (syncTargetInfoText) {
	// 		output = JSON.parse(syncTargetInfoText);
	// 		if (!output.version) throw new Error('Missing "version" field in info.json');
	// 	} else {
	// 		const oldVersion = await this.api_.get('.sync/version.txt');
	// 		if (oldVersion) output = { version: 1 };
	// 	}

	// 	return output;
	// }

	private serializeSyncTargetInfo(info: SyncTargetInfo) {
		return JSON.stringify(info);
	}

	public async checkCanSync(remoteInfo: SyncInfo = null) {
		remoteInfo = remoteInfo || await syncInfoUtils.fetchSyncInfo(this.api_);
		const supportedSyncTargetVersion = Setting.get('syncVersion');

		if (remoteInfo.version) {
			if (remoteInfo.version > supportedSyncTargetVersion) {
				throw new Error(`Sync version of the target (${remoteInfo.version}) is greater than the version supported by the app (${supportedSyncTargetVersion}). Please upgrade your app.`);
			} else if (remoteInfo.version < supportedSyncTargetVersion) {
				throw new Error(`Sync version of the target (${remoteInfo.version}) is lower than the version supported by the app (${supportedSyncTargetVersion}). Please upgrade your app.`);
			}
		}
	}

	async upgrade(targetVersion: number = 0) {
		const supportedSyncTargetVersion = Setting.get('syncVersion');
		const syncTargetInfo = await syncInfoUtils.fetchSyncInfo(this.api_);

		if (syncTargetInfo.version > supportedSyncTargetVersion) {
			throw new Error(`Sync version of the target (${syncTargetInfo.version}) is greater than the version supported by the app (${supportedSyncTargetVersion}). Please upgrade your app.`);
		}

		// if (supportedSyncTargetVersion !== migrations.length - 1) {
		// 	// Sanity check - it means a migration has been added by syncVersion has not be incremented or vice-versa,
		// 	// so abort as it can cause strange issues.
		// 	throw new stoicError('Application error: mismatch between max supported sync version and max migration number: ' + supportedSyncTargetVersion + ' / ' + (migrations.length - 1));
		// }

		// Special case for version 1 because it didn't have the lock folder and without
		// it the lock handler will break. So we create the directory now.
		// Also if the sync target version is 0, it means it's a new one so we need the
		// lock folder first before doing anything else.
		// Temp folder is needed too to get remoteDate() call to work.
		if (syncTargetInfo.version === 0 || syncTargetInfo.version === 1) {
			this.logger().info(`MigrationHandler: Sync target version is 0 or 1 - creating "locks" and "temp" directory: ${JSON.stringify(syncTargetInfo)}`);
			await this.api_.mkdir(Dirnames.Locks);
			await this.api_.mkdir(Dirnames.Temp);
		}

		this.logger().info('MigrationHandler: Acquiring exclusive lock');
		const exclusiveLock = await this.lockHandler_.acquireLock(this.clientType_, this.clientId_, {
			timeoutMs: 1000 * 30,
		});

		let autoLockError = null;
		this.lockHandler_.startAutoLockRefresh(exclusiveLock, (error: any) => {
			autoLockError = error;
		});

		this.logger().info('MigrationHandler: Acquired exclusive lock');

		try {
			for (let newVersion = syncTargetInfo.version + 1; newVersion < migrations.length; newVersion++) {
				if (targetVersion && newVersion > targetVersion) break;

				const fromVersion = newVersion - 1;

				this.logger().info(`MigrationHandler: Migrating from version ${fromVersion} to version ${newVersion}`);

				const migration = migrations[newVersion];
				if (!migration) continue;

				try {
					if (autoLockError) throw autoLockError;
					await migration(this.api_, this.db_);
					if (autoLockError) throw autoLockError;

					this.logger().info(`MigrationHandler: Done migrating from version ${fromVersion} to version ${newVersion}`);
				} catch (error) {
					error.message = `Could not upgrade from version ${fromVersion} to version ${newVersion}: ${error.message}`;
					throw error;
				}
			}
		} finally {
			this.logger().info('MigrationHandler: Releasing exclusive lock');
			this.lockHandler_.stopAutoLockRefresh(exclusiveLock);
			await this.lockHandler_.releaseLock(this.clientType_, this.clientId_);
		}
	}

}
