
import { createStore, Store } from '@reduxjs/toolkit'
import bridge from '../bridge';
import BaseSyncTarget from '../lib/BaseSyncTarget'
import Database from "../lib/Database";
import FileApiDriverLocal from '../lib/FileApiDriverLocal';
import FsDriverNode from '../lib/FsDriverNode';
import Logger from "../lib/Logger";
import shim from "../lib/shim";
import store from "../lib/store"
import { envFromArgs, profilePathFromArgs, isDebugMode } from '../lib/startupHelpers';
import SyncTargetFilesystem from '../lib/SyncTargetFilesystem';
import SyncTargetNone from "../lib/SyncTargetNone";
import SyncTargetRegistry from "../lib/SyncTargetRegistry";
import Account from '../models/Account';
import BaseItem from '../models/BaseItem';
import BaseModel from "../models/BaseModel";
import Category from '../models/Category';
import CategoryGroup from '../models/CategoryGroup';
import Setting from "../models/Setting";
import Target from '../models/Target';
import Transaction from '../models/Transaction';
import Transfer from '../models/Transfer';
import BaseService from "../services/BaseService";
import { toSystemSlashes } from '../utils/pathUtils';

const os = require('os');
const fs = require('fs-extra');

export default class BaseApplication {
	private database_: any = null;
	protected store_: Store<any> = null;

	

	public async start(argv: string[]): Promise<any> {
        // TODO: Implement search Service
        // TODO: Add time, date, locale and currency format customization
        // TODO: Sync startup operations such as clearing local sync state info

        const fsDriver = new FsDriverNode();
        Logger.setFsDriver(fsDriver)
        FileApiDriverLocal.setFsDriver(fsDriver)

        // // That's not good, but it's to avoid circular dependency issues
        // // in the BaseItem class.
        BaseItem.loadClass('Account', Account);
        BaseItem.loadClass('Category', Category);
        BaseItem.loadClass('CategoryGroup', CategoryGroup);
        BaseItem.loadClass('Target', Target);
        BaseItem.loadClass('Transaction', Transaction);
        BaseItem.loadClass('Transfer', Transfer);

        const env = envFromArgs(argv)
        const profilePath = this.determineProfileDir(argv)
        const debugMode = isDebugMode(argv)

		const tempDir = `${profilePath}/tmp`;
		const cacheDir = `${profilePath}/cache`;

		Setting.setConstant('env', env);
		Setting.setConstant('profileDir', profilePath);
		Setting.setConstant('tempDir', tempDir);
		Setting.setConstant('cacheDir', cacheDir);

		SyncTargetRegistry.addClass(SyncTargetNone);
		SyncTargetRegistry.addClass(SyncTargetFilesystem);

		try {
            // Perform shimInit frist before using this!
            // Question: why is this using shim while mkdirp does not?
			await shim.fsDriver().remove(tempDir); 
		} catch (error) {
			// Can't do anything in this case, not even log, since the logger
			// is not yet ready. But normally it's not an issue if the temp
			// dir cannot be deleted.
		}

		await fs.mkdirp(profilePath, 0o755);
		await fs.mkdirp(tempDir, 0o755);
		await fs.mkdirp(cacheDir, 0o755);

		const globalLogger = new Logger();
		BaseService.logger_ = globalLogger;

		this.database_ = new Database(globalLogger);
		this.database_.setLogger(globalLogger);

		BaseModel.setDb(this.database_);

		if (Setting.get('firstStart')) {

			if (Setting.get('env') === 'dev') {
				Setting.set('showTrayIcon', '0');
				Setting.set('autoUpdateEnabled', '0');
				Setting.set('sync.interval', '3600');
			}

			Setting.set('sync.target', '0');
			Setting.set('firstStart', '0');
		}

		return argv;
	}

    public store() {
		return this.store_;
	}

    public dispatch(action: any) {
		if (this.store()) return this.store().dispatch(action);
	}

	public determineProfileDir(initArgs: any) {
		let output = '';

		if (initArgs.profileDir) {
			output = initArgs.profileDir;
		} else if (process && process.env && process.env.PORTABLE_EXECUTABLE_DIR) {
			output = `${process.env.PORTABLE_EXECUTABLE_DIR}/JoplinProfile`;
		} else {
			output = `${os.homedir()}/.config/${Setting.get('appName')}`;
		}

		return toSystemSlashes(output, 'linux');
	}

	public reducer(state: any = { value: 0 }, action) {
		switch (action.type) {
			case 'counter/incremented':
			return { value: state.value + 1 }
		case 'counter/decremented':
			return { value: state.value - 1 }
		default:
			return state
		}
	}

	public initRedux() {
		this.store_ = store
		BaseModel.dispatch = this.store().dispatch
		BaseSyncTarget.dispatch = this.store().dispatch

	}

}