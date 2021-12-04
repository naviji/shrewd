// import ResourceEditWatcher from '@joplin/lib/services/ResourceEditWatcher/index';
// import CommandService from '@joplin/lib/services/CommandService';
// import KeymapService from '@joplin/lib/services/KeymapService';
// import PluginService, { PluginSettings } from '@joplin/lib/services/plugins/PluginService';
// import resourceEditWatcherReducer, { defaultState as resourceEditWatcherDefaultState } from '@joplin/lib/services/ResourceEditWatcher/reducer';
// import PluginRunner from './services/plugins/PluginRunner';
// import PlatformImplementation from './services/plugins/PlatformImplementation';
// import shim from '@joplin/lib/shim';
// import AlarmService from '@joplin/lib/services/AlarmService';
// import AlarmServiceDriverNode from '@joplin/lib/services/AlarmServiceDriverNode';
// import Logger, { TargetType } from '@joplin/lib/Logger';
// import Setting from '@joplin/lib/models/Setting';
// import actionApi from '@joplin/lib/services/rest/actionApi.desktop';
// import BaseApplication from '@joplin/lib/BaseApplication';
// import DebugService from '@joplin/lib/debug/DebugService';
// import { _, setLocale } from '@joplin/lib/locale';
// import SpellCheckerService from '@joplin/lib/services/spellChecker/SpellCheckerService';
// import SpellCheckerServiceDriverNative from './services/spellChecker/SpellCheckerServiceDriverNative';
// import bridge from './services/bridge';
// import menuCommandNames from './gui/menuCommandNames';
// import stateToWhenClauseContext from './services/commands/stateToWhenClauseContext';
// import ResourceService from '@joplin/lib/services/ResourceService';
// import ExternalEditWatcher from '@joplin/lib/services/ExternalEditWatcher';
// import appReducer, { createAppDefaultState } from './app.reducer';
// const { FoldersScreenUtils } = require('@joplin/lib/folders-screen-utils.js');
// import Folder from '@joplin/lib/models/Folder';
// const fs = require('fs-extra');
// import Tag from '@joplin/lib/models/Tag';
// import { reg } from '@joplin/lib/registry';
// const packageInfo = require('./packageInfo.js');
// import DecryptionWorker from '@joplin/lib/services/DecryptionWorker';
// import ClipperServer from '@joplin/lib/ClipperServer';
// const { webFrame } = require('electron');
// const Menu = bridge().Menu;
// const PluginManager = require('@joplin/lib/services/PluginManager');
// import RevisionService from '@joplin/lib/services/RevisionService';
// import MigrationService from '@joplin/lib/services/MigrationService';
// import { loadCustomCss, injectCustomStyles } from '@joplin/lib/CssUtils';
// import mainScreenCommands from './gui/MainScreen/commands/index';
// import noteEditorCommands from './gui/NoteEditor/commands/index';
// import noteListCommands from './gui/NoteList/commands/index';
// import noteListControlsCommands from './gui/NoteListControls/commands/index';
// import sidebarCommands from './gui/Sidebar/commands/index';
// import appCommands from './commands/index';
// import libCommands from '@joplin/lib/commands/index';
// const electronContextMenu = require('./services/electron-context-menu');


import Setting from './models/Setting';
import CommandService from './services/CommandService';
const bridge = require('@electron/remote').require('./bridge').default;

// import ShareService from '@joplin/lib/services/share/ShareService';
// import checkForUpdates from './checkForUpdates';
// import { AppState } from './app.reducer';

// import { runIntegrationTests } from '@joplin/lib/services/e2ee/ppkTestUtils';

// const pluginClasses = [
// 	require('./plugins/GotoAnything').default,
// ];

const appDefaultState = createAppDefaultState(
	bridge().windowContentSize(),
);

class Application extends BaseApplication {


	public async start(argv: string[]): Promise<any> {
		argv = await super.start(argv);

		await this.applySettingsSideEffects(); // What does this do?

		const dir = Setting.get('profileDir');

		reg.setShowErrorMessageBoxHandler((message: string) => { bridge().showErrorMessageBox(message); });

		if (Setting.get('flagOpenDevTools')) {
			bridge().openDevTools();
		}

		this.initRedux();

        CommandService.instance().registerAll()

        // TODO: Shortcuts and keymap service
        // TODO: Alarm service

		// Since the settings need to be loaded before the store is
		// created, it will never receive the SETTING_UPDATE_ALL even,
		// which mean state.settings will not be initialised. So we
		// manually call dispatchUpdateAll() to force an update.
		Setting.dispatchUpdateAll();

		const folders = await this.allForDisplay({ includeConflictFolder: true });

        this.dispatch({  // What's the differnece between a store dispatch and a normal dispatch??
            type: 'FOLDER_UPDATE_ALL', 
            items: folders,
        });

		this.store().dispatch({
			type: 'SECTION_SELECT',
			id: Setting.get('activeSectionId'),
		});

		this.store().dispatch({
			type: 'FOLDER_SET_COLLAPSED_ALL',
			ids: Setting.get('collapsedFolderIds'),
		});

		this.store().dispatch({
			type: 'NOTE_DEVTOOLS_SET',
			value: Setting.get('flagOpenDevTools'),
		});

		this.updateTray();

		if (Setting.get('startMinimized') && Setting.get('showTrayIcon')) {
			// Keep it hidden
		} else {
			bridge().window().show();
		}

		return null;
	}

	public hasGui() {
		return true;
	}

	public reducer(state: AppState = appDefaultState, action: any) {
		let newState = appReducer(state, action);
		newState = resourceEditWatcherReducer(newState, action);
		newState = super.reducer(newState, action);
		return newState;
	}

	public toggleDevTools(visible: boolean) {
		if (visible) {
			bridge().openDevTools();
		} else {
			bridge().closeDevTools();
		}
	}

	protected async generalMiddleware(store: any, next: any, action: any) {
        // TODO: Multi language support using locale
		// if (action.type == 'SETTING_UPDATE_ONE' && action.key == 'locale' || action.type == 'SETTING_UPDATE_ALL') {
		// 	// setLocale(Setting.get('locale')); 
		// 	// The bridge runs within the main process, with its own instance of locale.js
		// 	// so it needs to be set too here.
		// 	// bridge().setLocale(Setting.get('locale'));
		// }

		if (action.type == 'SETTING_UPDATE_ONE' && action.key == 'showTrayIcon' || action.type == 'SETTING_UPDATE_ALL') {
			this.updateTray();
		}

		if (action.type == 'SETTING_UPDATE_ONE' && action.key == 'style.editor.fontFamily' || action.type == 'SETTING_UPDATE_ALL') {
			this.updateEditorFont();
		}

		if (action.type == 'SETTING_UPDATE_ONE' && action.key == 'windowContentZoomFactor' || action.type == 'SETTING_UPDATE_ALL') {
			webFrame.setZoomFactor(Setting.get('windowContentZoomFactor') / 100);
		}

        // TODO: Alarm service for overspending reminder and reconciliation
		// if (['EVENT_NOTE_ALARM_FIELD_CHANGE', 'NOTE_DELETE'].indexOf(action.type) >= 0) {
		// 	await AlarmService.updateNoteNotification(action.id, action.type === 'NOTE_DELETE');
		// }

		const result = await super.generalMiddleware(store, next, action); // Why are we calling super.generalMiddleware here and not at the top??
		const newState = store.getState();

		if (['NOTE_VISIBLE_PANES_TOGGLE', 'NOTE_VISIBLE_PANES_SET'].indexOf(action.type) >= 0) {
			Setting.set('noteVisiblePanes', newState.noteVisiblePanes);
		}

		if (['NOTE_DEVTOOLS_TOGGLE', 'NOTE_DEVTOOLS_SET'].indexOf(action.type) >= 0) {
			this.toggleDevTools(newState.devToolsVisible);
		}

		// if (action.type === 'FOLDER_AND_NOTE_SELECT') {
		// 	await Folder.expandTree(newState.folders, action.folderId);
		// }

        // TODO: Themes (Make a dark theme and a light theme)
		// if (this.hasGui() && ((action.type == 'SETTING_UPDATE_ONE' && ['themeAutoDetect', 'theme', 'preferredLightTheme', 'preferredDarkTheme'].includes(action.key)) || action.type == 'SETTING_UPDATE_ALL')) {
		// 	this.handleThemeAutoDetect();
		// }

		return result;
	}

	public handleThemeAutoDetect() {
		if (!Setting.get('themeAutoDetect')) return;

		if (bridge().shouldUseDarkColors()) {
			Setting.set('theme', Setting.get('preferredDarkTheme'));
		} else {
			Setting.set('theme', Setting.get('preferredLightTheme'));
		}
	}

	private bridge_nativeThemeUpdated() {
		this.handleThemeAutoDetect();
	}

	public updateTray() {
		const app = bridge().electronApp();

		if (app.trayShown() === Setting.get('showTrayIcon')) return;

		if (!Setting.get('showTrayIcon')) {
			app.destroyTray();
		} else {
			const contextMenu = Menu.buildFromTemplate([
				{ label: _('Open %s', app.electronApp().name), click: () => { app.window().show(); } },
				{ type: 'separator' },
				{ label: _('Quit'), click: () => { void app.quit(); } },
			]);
			app.createTray(contextMenu);
		}
	}

	public updateEditorFont() {
		const fontFamilies = [];
		if (Setting.get('style.editor.fontFamily')) fontFamilies.push(`"${Setting.get('style.editor.fontFamily')}"`);
		fontFamilies.push('Avenir, Arial, sans-serif');

		// The '*' and '!important' parts are necessary to make sure Russian text is displayed properly
		// https://github.com/laurent22/joplin/issues/155

		const css = `.CodeMirror * { font-family: ${fontFamilies.join(', ')} !important; }`;
		const styleTag = document.createElement('style');
		styleTag.type = 'text/css';
		styleTag.appendChild(document.createTextNode(css));
		document.head.appendChild(styleTag);
	}
}

let application_: Application = null;

function app() {
	if (!application_) application_ = new Application();
	return application_;
}

export default app;
