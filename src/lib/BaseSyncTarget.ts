import Logger from './Logger'
import Synchronizer from './Synchronizer'
// import EncryptionService from './services/e2ee/EncryptionService';
// import shim from './shim';
// import ResourceService from './services/ResourceService';
// import ShareService from './services/share/ShareService';

export default class BaseSyncTarget {
    public static dispatch: Function = () => {};

    private synchronizer_: Synchronizer = null;
    private initState_: any = null;
    private logger_: Logger = null;
    private options_: any;
    private db_: any;
    protected fileApi_: any;

    public constructor (db: any, options: any = null) {
      this.db_ = db
      this.options_ = options
    }

    // Usually each sync target should create and setup its own file API via initFileApi()
    // but for testing purposes it might be convenient to provide it here so that multiple
    // clients can share and sync to the same file api (see test-utils.js)
    public setFileApi (v: any) {
      this.fileApi_ = v
    }

    protected logger () {
      return this.logger_
    }

    public setLogger (v: Logger) {
      this.logger_ = v
    }

    protected async initSynchronizer (): Promise<Synchronizer> {
      throw new Error('initSynchronizer() not implemented')
    }

    public async synchronizer (): Promise<Synchronizer> {
      if (this.synchronizer_) return this.synchronizer_
      this.synchronizer_ = await this.initSynchronizer()
      this.synchronizer_.setLogger(this.logger())
      return this.synchronizer_
    }

    protected db () {
      return this.db_
    }

    public async fileApi () {
      if (this.fileApi_) return this.fileApi_
      this.fileApi_ = await this.initFileApi()
      return this.fileApi_
    }

    protected async initFileApi (): Promise<any> {
      throw new Error('initFileApi() not implemented')
    }

    public static supportsConfigCheck () {
      return false
    }

    public static description (): string {
      return ''
    }

    public static supportsSelfHosted (): boolean {
      return true
    }

  // public option(name: string, defaultValue: any = null) {
  // 	return this.options_ && name in this.options_ ? this.options_[name] : defaultValue;
  // }

  // // If [] is returned it means all platforms are supported
  // public static unsupportedPlatforms(): any[] {
  // 	return [];
  // }

  // public async isAuthenticated() {
  // 	return false;
  // }

  // public authRouteName(): string {
  // 	return null;
  // }

  // public static id() {
  // 	throw new Error('id() not implemented');
  // }

  // // Note: it cannot be called just "name()" because that's a reserved keyword and
  // // it would throw an obscure error in React Native.
  // public static targetName() {
  // 	throw new Error('targetName() not implemented');
  // }

  // public static label() {
  // 	throw new Error('label() not implemented');
  // }

  // public async syncStarted() {
  // 	if (!this.synchronizer_) return false;
  // 	if (!(await this.isAuthenticated())) return false;
  // 	const sync = await this.synchronizer();
  // 	return sync.state() != 'idle';
  // }
}
