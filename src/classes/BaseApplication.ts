import Database from "../lib/Database";
import Logger from "../lib/Logger";
import SyncTargetNone from "../lib/SyncTargetNone";
import SyncTargetRegistry from "../lib/SyncTargetRegistry";
import Setting from "../models/Setting";
import BaseService from "../services/BaseService";











class BaseApplication {
	private database_: any = null;
	protected store_: Store<any> = null;


	public async start(argv: string[], options: StartOptions = null): Promise<any> {
		options = {
			keychainEnabled: true,
			...options,
		};

		const startFlags = await this.handleStartFlags_(argv);

		argv = startFlags.argv;
		let initArgs = startFlags.matched;
		if (argv.length) this.showPromptString_ = false;

		let appName = initArgs.env == 'dev' ? 'joplindev' : 'joplin';
		if (Setting.get('appId').indexOf('-desktop') >= 0) appName += '-desktop';
		Setting.setConstant('appName', appName);

		// https://immerjs.github.io/immer/docs/freezing
		setAutoFreeze(initArgs.env === 'dev');

		const profileDir = this.determineProfileDir(initArgs);
		const resourceDirName = 'resources';
		const resourceDir = `${profileDir}/${resourceDirName}`;
		const tempDir = `${profileDir}/tmp`;
		const cacheDir = `${profileDir}/cache`;

		Setting.setConstant('env', initArgs.env);
		Setting.setConstant('profileDir', profileDir);
		Setting.setConstant('tempDir', tempDir);
		Setting.setConstant('cacheDir', cacheDir);

		SyncTargetRegistry.addClass(SyncTargetNone);
		SyncTargetRegistry.addClass(SyncTargetFilesystem);
		// SyncTargetRegistry.addClass(SyncTargetOneDrive);
		// SyncTargetRegistry.addClass(SyncTargetNextcloud);
		// SyncTargetRegistry.addClass(SyncTargetWebDAV);
		// SyncTargetRegistry.addClass(SyncTargetDropbox);
		// SyncTargetRegistry.addClass(SyncTargetAmazonS3);
		// SyncTargetRegistry.addClass(SyncTargetJoplinServer);
		// SyncTargetRegistry.addClass(SyncTargetJoplinCloud);

		try {
			await shim.fsDriver().remove(tempDir); // why is this using shim while mkdirp does not?
		} catch (error) {
			// Can't do anything in this case, not even log, since the logger
			// is not yet ready. But normally it's not an issue if the temp
			// dir cannot be deleted.
		}

		await fs.mkdirp(profileDir, 0o755);
		await fs.mkdirp(resourceDir, 0o755);
		await fs.mkdirp(tempDir, 0o755);
		await fs.mkdirp(cacheDir, 0o755);

		const globalLogger = new Logger();
		BaseService.logger_ = globalLogger;

		this.database_ = new Database(globalLogger);
		// this.database_.setLogExcludedQueryTypes(['SELECT']);
		this.database_.setLogger(globalLogger);

		// await this.database_.open({ name: `${profileDir}/database.sqlite` });

		// if (Setting.get('env') === 'dev') await this.database_.clearForTesting();

		reg.setDb(this.database_);
		BaseModel.setDb(this.database_);

		// setRSA(RSA);

		// await loadKeychainServiceAndSettings(options.keychainEnabled ? KeychainServiceDriver : KeychainServiceDriverDummy);
		// await migrateMasterPassword();
		await handleSyncStartupOperation();

		appLogger.info(`Client ID: ${Setting.get('clientId')}`);

		if (Setting.get('firstStart')) {
			// const locale = shim.detectAndSetLocale(Setting);
			// reg.logger().info(`First start: detected locale as ${locale}`);

			if (Setting.get('env') === 'dev') {
				Setting.set('showTrayIcon', 0);
				Setting.set('autoUpdateEnabled', 0);
				Setting.set('sync.interval', 3600);
			}

			Setting.set('sync.target', 0);
			Setting.set('firstStart', 0);
		} 


		// if (Setting.get('env') === Env.Dev) {
		// 	// Setting.set('sync.10.path', 'https://api.joplincloud.com');
		// 	// Setting.set('sync.10.userContentPath', 'https://joplinusercontent.com');
		// 	Setting.set('sync.10.path', 'http://api.joplincloud.local:22300');
		// 	Setting.set('sync.10.userContentPath', 'http://joplinusercontent.local:22300');
		// }

		// For now always disable fuzzy search due to performance issues:
		// https://discourse.joplinapp.org/t/1-1-4-keyboard-locks-up-while-typing/11231/11
		// https://discourse.joplinapp.org/t/serious-lagging-when-there-are-tens-of-thousands-of-notes/11215/23
		// Setting.set('db.fuzzySearchEnabled', 0);

		// if (Setting.get('encryption.shouldReencrypt') < 0) {
		// 	// We suggest re-encryption if the user has at least one notebook
		// 	// and if encryption is enabled. This code runs only when shouldReencrypt = -1
		// 	// which can be set by a maintenance script for example.
		// 	const folderCount = await Folder.count();
		// 	const itShould = getEncryptionEnabled() && !!folderCount ? Setting.SHOULD_REENCRYPT_YES : Setting.SHOULD_REENCRYPT_NO;
		// 	Setting.set('encryption.shouldReencrypt', itShould);
		// }

		// if ('welcomeDisabled' in initArgs) Setting.set('welcome.enabled', !initArgs.welcomeDisabled);

		// if (!Setting.get('api.token')) {
		// 	void EncryptionService.instance()
		// 		.generateApiToken()
		// 		.then((token: string) => {
		// 			Setting.set('api.token', token);
		// 		});
		// }

		time.setDateFormat(Setting.get('dateFormat'));
		time.setTimeFormat(Setting.get('timeFormat'));

		// BaseItem.revisionService_ = RevisionService.instance();

		// KvStore.instance().setDb(reg.db());

		// BaseItem.encryptionService_ = EncryptionService.instance();
		// BaseItem.shareService_ = ShareService.instance();
		// DecryptionWorker.instance().setLogger(globalLogger);
		// DecryptionWorker.instance().setEncryptionService(EncryptionService.instance());
		// DecryptionWorker.instance().setKvStore(KvStore.instance());
		// await loadMasterKeysFromSettings(EncryptionService.instance());
		// DecryptionWorker.instance().on('resourceMetadataButNotBlobDecrypted', this.decryptionWorker_resourceMetadataButNotBlobDecrypted);

		// ResourceFetcher.instance().setFileApi(() => {
		// 	return reg.syncTarget().fileApi();
		// });
		// ResourceFetcher.instance().setLogger(globalLogger);
		// ResourceFetcher.instance().on('downloadComplete', this.resourceFetcher_downloadComplete);
		// void ResourceFetcher.instance().start();


        // TODO: Implement search
		// SearchEngine.instance().setDb(reg.db());
		// SearchEngine.instance().setLogger(reg.logger());
		// SearchEngine.instance().scheduleSyncTables();

		const currentFolderId = Setting.get('activeFolderId');
		let currentFolder = null;
		if (currentFolderId) currentFolder = await Folder.load(currentFolderId);
		if (!currentFolder) currentFolder = await Folder.defaultFolder();
		Setting.set('activeFolderId', currentFolder ? currentFolder.id : '');

		await MigrationService.instance().run();

		return argv;
	}
}

function SyncTargetFilesystem(SyncTargetFilesystem: any) {
    throw new Error("Function not implemented.");
}
