import Database from "../lib/Database"
import FileApi from "../lib/FileApi"
import Logger from "../lib/Logger"
import SyncTargetMemory from "../lib/SyncTargetMemory"
import BaseModel from "../models/BaseModel"
import BaseService from "../services/BaseService"
import FileApiDriverMemory from "../lib/FileApiDriverMemory"
import timeUtils from "../utils/timeUtils"

const logger = new Logger()
const databases_ = new Map<number, Database>()
const fileApi_ = new FileApi('/root', new FileApiDriverMemory());
const synchronizers_ = new Map<number, any>()
const settings = new Map<string, string>()

let currentClient_ = 1;


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
    const context = settings['context'] ? JSON.parse(settings['context']) : {};
    const options = Object.assign({ context : context, throwOnError : true }, extraOptions);

	const newContext = await synchronizer(id).start(options);
    settings['context'] = JSON.stringify(newContext)
}