import Database from "../lib/Database"
import FileApi from "../lib/FileApi"
import Logger from "../lib/Logger"
import SyncTargetMemory from "../lib/SyncTargetMemory"
import BaseModel from "../models/BaseModel"
import BaseItem from "../models/BaseItem"
import BaseService from "../services/BaseService"
import FileApiDriverMemory from "../lib/FileApiDriverMemory"
import timeUtils from "../utils/timeUtils"
import Setting from "../models/Setting"
import * as fs from 'fs-extra';

import Account from "../models/Account"
import Category from "../models/Category"
import CategoryGroup from "../models/CategoryGroup"
import Target from "../models/Target"
import Transaction from "../models/Transaction"
import Transfer from "../models/Transfer"

const logger = new Logger()
const databases_ = new Map<number, Database>()
const fileApi_ = new FileApi('/root', new FileApiDriverMemory());
const synchronizers_ = new Map<number, any>()
const settings = new Map<string, string>()

let currentClient_ = 1;

BaseItem.loadClass('Account', Account);
BaseItem.loadClass('Category', Category);
BaseItem.loadClass('CategoryGroup', CategoryGroup);
BaseItem.loadClass('Target', Target);
BaseItem.loadClass('Transaction', Transaction);
BaseItem.loadClass('Transfer', Transfer);

const suiteName_ = Math.floor(Math.random()*1000000000)

const testDir = `${__dirname}`;
const logDir = `${testDir}/logs`;
const baseTempDir = `${testDir}/tmp/${suiteName_}`;
const supportDir = `${testDir}/support`;


// We add a space in the data directory path as that will help uncover
// various space-in-path issues.
const dataDir = `${testDir}/test data/${suiteName_}`;
const profileDir = `${dataDir}/profile`;

// This needs the database to be initialized first
Setting.setConstant('appId', 'net.naviji.buddytest-cli');
Setting.setConstant('appType', 'cli');
Setting.setConstant('tempDir', baseTempDir);
Setting.setConstant('cacheDir', baseTempDir);
Setting.setConstant('pluginDataDir', `${profileDir}/profile/plugin-data`);
Setting.setConstant('profileDir', profileDir);
Setting.setConstant('env', 'dev');


fs.mkdirpSync(logDir);
fs.mkdirpSync(baseTempDir);
fs.mkdirpSync(dataDir);
fs.mkdirpSync(profileDir);


export const setupDatabaseAndSynchronizer = async (id) => {
    // console.log("Calling setup", n)
    BaseService.logger_ = logger
    databases_[id] = new Database(logger)
    BaseModel.setDb(databases_[id])

    if (!synchronizers_[id]) {
		const syncTarget = new SyncTargetMemory(databases_[id]);
        
		syncTarget.setFileApi(fileApi_);
		syncTarget.setLogger(logger);
		synchronizers_[id] = await syncTarget.synchronizer();
	}

    fileApi_.initialize();
    fileApi_.clearRoot();
}

const fileApi = () => fileApi_

const synchronizer = (id: number = null) => {
	if (id === null) id = currentClient_;
	return synchronizers_[id];
}

export const switchClient = async (id) => {
    // console.log("Calling switch", n)
	if (!databases_[id]) throw new Error(`Call setupDatabaseAndSynchronizer(${id}) first!!`);
    currentClient_ = id;
	await timeUtils.msleep(10); // Always leave a little time so that updated_time properties don't overlap
	BaseModel.setDb(databases_[id]);
}


export async function afterAllCleanUp() {
	if (fileApi()) {
		try {
			await fileApi().clearRoot();
		} catch (error) {
			console.warn('Could not clear sync target root:', error);
		}
	}
}

export async function synchronizerStart(id = null, extraOptions = {}) {
    if (id === null) id = currentClient_;
    const context = Setting.get('context') ? JSON.parse(Setting.get('context')) : {};
    const options = Object.assign({ context : context, throwOnError : true }, extraOptions);

	const newContext = await synchronizer(id).start(options);
    Setting.set('context', JSON.stringify(newContext))
}