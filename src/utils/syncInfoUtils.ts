import Setting from '../models/Setting'
import FileApi from '../lib/FileApi'

const localSyncInfo = () => {
  return new SyncInfo(Setting.get('localSyncInfo'))
}

const saveLocalSyncInfo = (syncInfo) => {
  Setting.set('localSyncInfo', JSON.stringify(syncInfo))
}

const uploadSyncInfo = async (api: FileApi, syncInfo: SyncInfo) => {
  await api.put('info.json', syncInfo.serialize())
}

const fetchSyncInfo = async (api: FileApi): Promise<SyncInfo> => {
  const syncTargetInfoText = await api.get('info.json')

  // Returns version 0 if the sync target is empty
  let output: any = { version: 0 }

  if (syncTargetInfoText) {
    output = new SyncInfo(syncTargetInfoText)
    if (!output.version) throw new Error('Missing "version" field in info.json')
  }

  return output
}

export class SyncInfo {
    private version_: number = 0;
    // private e2ee_: SyncInfoValueBoolean;
    // private activeMasterKeyId_: SyncInfoValueString;
    // private masterKeys_: MasterKeyEntity[] = [];
    // private ppk_: SyncInfoValuePublicPrivateKeyPair;

    public constructor (serialized: string = null) {
      // this.e2ee_ = { value: false, updatedAt: 0 };
      // this.activeMasterKeyId_ = { value: '', updatedAt: 0 };
      // this.ppk_ = { value: null, updatedAt: 0 };

      if (serialized) this.load(serialized)
    }

    public toObject (): any {
      return {
        version: this.version
        // e2ee: this.e2ee_,
        // activeMasterKeyId: this.activeMasterKeyId_,
        // masterKeys: this.masterKeys,
        // ppk: this.ppk_,
      }
    }

    public serialize (): string {
      return JSON.stringify(this.toObject(), null, '\t')
    }

    public load (serialized: string) {
      const s: any = JSON.parse(serialized)
      this.version = 'version' in s ? s.version : 0
    }

    public get version (): number {
      return this.version_
    }

    public set version (v: number) {
      if (v === this.version_) return

      this.version_ = v
    }
}

export default {
  localSyncInfo,
  uploadSyncInfo,
  fetchSyncInfo,
  saveLocalSyncInfo
}
