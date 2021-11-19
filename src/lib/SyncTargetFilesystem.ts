import Setting from "../models/Setting";
import BaseSyncTarget from "./BaseSyncTarget";
import FileApi from "./FileApi";
import FileApiDriverMemory from "./FileApiDriverMemory";
import Synchronizer from "./Synchronizer";

class SyncTargetFilesystem extends BaseSyncTarget {
	static id() {
		return 2;
	}

	static targetName() {
		return 'filesystem';
	}

	static label() {
		return 'File system';
	}

	static unsupportedPlatforms() {
		return ['ios'];
	}

	async isAuthenticated() {
		return true;
	}

	// async initFileApi() {
	// 	const syncPath = Setting.get('sync.2.path');
	// 	const driver = new FileApiDriverLocal();
	// 	const fileApi = new FileApi(syncPath, driver);
	// 	fileApi.setLogger(this.logger());
	// 	fileApi.setSyncTargetId(SyncTargetFilesystem.id());
	// 	await driver.mkdir(syncPath);
	// 	return fileApi;
	// }

	async initSynchronizer() {
		return new Synchronizer(this.db(), await this.fileApi(), Setting.get('appType'));
	}
}

module.exports = SyncTargetFilesystem;
