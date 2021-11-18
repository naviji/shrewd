// const BaseSyncTarget = require('./BaseSyncTarget').default;
import BaseSyncTarget from "./BaseSyncTarget";
import FileApi from "./FileApi";
import FileApiDriverMemory from "./FileApiDriverMemory";
import Synchronizer from "./Synchronizer";
// const Setting = require('./models/Setting').default;
// const { FileApi } = require('./file-api.js');
// const FileApiDriverMemory = require('./file-api-driver-memory').default;
// const Synchronizer = require('./Synchronizer').default;

class SyncTargetMemory extends BaseSyncTarget {
	static id() {
		return 1;
	}

	static targetName() {
		return 'memory';
	}

	static label() {
		return 'Memory';
	}

	async isAuthenticated() {
		return true;
	}

	async initFileApi() {
		const fileApi = new FileApi('/root', new FileApiDriverMemory());
		fileApi.setLogger(this.logger());
		fileApi.setSyncTargetId(SyncTargetMemory.id());
		return fileApi;
	}

	async initSynchronizer() {
		return new Synchronizer(this.db(), await this.fileApi(), 'test');
	}
}

export default SyncTargetMemory