

import { webFrame, Menu } from 'electron';
import BaseApplication from './classes/BaseApplication';
import _ from './lib/migrations/1';
import { envFromArgs, profilePathFromArgs, isDebugMode } from './lib/startupHelpers';
import Setting from './models/Setting';
import CommandService from './services/CommandService';
import store from './lib/store'
import BaseModel from './models/BaseModel';
import BaseSyncTarget from './lib/BaseSyncTarget';
import Category from './models/Category';
import bridge from './bridgeWrapper';
const { shimInit } = require('./lib/ShimNode')


class Application extends BaseApplication {


	public async start(argv: string[]): Promise<any> {
        // TODO: Shortcuts and keymap service
        // TODO: Alarm service
        // TODO: Add Registry to create error message box windows 
        // TODO: Multi language support using locale
        // TODO: Alarm service for overspending reminder and reconciliation
        // TODO: Themes (Make a dark theme and a light theme)
        // TODO: Add Tray
        // TODO: Add the general Middleware concat with the general middleware
        // TODO: use bridge().windowContentSize() to keep track of window content size

        shimInit(bridge());

		argv = await super.start(argv);
        const env = envFromArgs(argv)

        Setting.setConstant('appId', `net.vinayan.stoic-${env}-desktop`);
        Setting.setConstant('appType', 'desktop');
        Setting.setConstant('appName', `stoic-${env}-desktop`);

		this.initRedux();

        CommandService.instance().registerAll()

		// Since the settings need to be loaded before the store is
		// created, it will never receive the SETTING_UPDATE_ALL even,
		// which mean state.settings will not be initialised. So we
		// manually call dispatchUpdateAll() to force an update.
        this.dispatch({
			type: 'settings/updateAll',
			payload: Setting.toPlainObject(),
		});

        this.dispatch({  // What's the differnece between a store dispatch and a normal dispatch??
            type: 'categories/updateAll', 
            items: Category.getAll(),
        });

		this.store().dispatch({
			type: 'categoryGroups/setCollapsed',
			ids: Setting.get('collapsedCategoryGroupIds'),
		});

        bridge().window().show();

		return null;
	}

    // private initRedux() {
    //     this.store_ = store
    //     BaseModel.dispatch = this.store().dispatch;
	// 	BaseSyncTarget.dispatch = this.store().dispatch;
    // }


	// protected async generalMiddleware(store: any, next: any, action: any) {
    //     // Middleware are for creating side effects in response to redux actions;
    //     // These generally include UI or settings updates or execting actions on models

	// 	if (action.type === 'settings/zoom' || action.type == 'settings/all') {
	// 		webFrame.setZoomFactor(Setting.get('windowContentZoomFactor') / 100);
	// 	}

	// 	const result = await super.generalMiddleware(store, next, action); // Why are we calling super.generalMiddleware here and not at the top??
	// 	const newState = store.getState();


	// 	// if (action.type === 'FOLDER_AND_NOTE_SELECT') {
	// 	// 	await Folder.expandTree(newState.folders, action.folderId);
	// 	// }

	// 	// if (this.hasGui() && ((action.type == 'SETTING_UPDATE_ONE' && ['themeAutoDetect', 'theme', 'preferredLightTheme', 'preferredDarkTheme'].includes(action.key)) || action.type == 'SETTING_UPDATE_ALL')) {
	// 	// 	this.handleThemeAutoDetect();
	// 	// }

	// 	return result;
	// }

}

let application_: Application = null;

function app() {
	if (!application_) application_ = new Application();
	return application_;
}

export default app;
// function shimInit(arg0: Bridge) {
//     throw new Error('Function not implemented.');
// }

