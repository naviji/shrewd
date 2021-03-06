import FileApi from "../FileApi";
import Database from "../Database";
import { Dirnames } from "../types";

import syncInfoUtils from "../../utils/syncInfoUtils";

export default async function(api: FileApi, _db: Database): Promise<void> {
	
    await api.mkdir(Dirnames.Locks)
    await api.mkdir(Dirnames.Temp)


	// syncInfo must be a SyncInfo Object!! How to do that? Where is it initialized.
	const syncInfo = syncInfoUtils.localSyncInfo();
	syncInfo.version = 1;
	await syncInfoUtils.uploadSyncInfo(api, syncInfo);
	syncInfoUtils.saveLocalSyncInfo(syncInfo);
}
