// // This is the initialization for the Electron RENDERER process
// TODO: Import react

import app from './app'
import FileApiDriverLocal from "./lib/FileApiDriverLocal";
import FsDriverNode from "./lib/FsDriverNode";
import Logger from "./lib/Logger";
import Account from "./models/Account";
import BaseItem from "./models/BaseItem";
import Category from "./models/Category";
import CategoryGroup from "./models/CategoryGroup";
import Setting from "./models/Setting";
import Target from "./models/Target";
import Transaction from "./models/Transaction";
import Transfer from "./models/Transfer";

const bridge = require('@electron/remote').require('./bridge').default;


console.info(`Environment: ${bridge().env()}`);


const fsDriver = new FsDriverNode();
Logger.setFsDriver(fsDriver)
FileApiDriverLocal.setFsDriver(fsDriver)

// // That's not good, but it's to avoid circular dependency issues
// // in the BaseItem class.
BaseItem.loadClass('Account', Account);
BaseItem.loadClass('Category', Category);
BaseItem.loadClass('CategoryGroup', CategoryGroup);
BaseItem.loadClass('Target', Target);
BaseItem.loadClass('Transaction', Transaction);
BaseItem.loadClass('Transfer', Transfer);

Setting.setConstant('appId', `net.vinayan.stoic${bridge.env() === 'dev' ? 'dev' : ''}-desktop`);
Setting.setConstant('appType', 'desktop');


// TOOD: Init shim here if needed

// Disable drag and drop of links inside application (which would
// open it as if the whole app was a browser)
document.addEventListener('dragover', event => event.preventDefault());
document.addEventListener('drop', event => event.preventDefault());

// Disable middle-click (which would open a new browser window, but we don't want this)
document.addEventListener('auxclick', event => event.preventDefault());

// Each link (rendered as a button or list item) has its own custom click event
// so disable the default. In particular this will disable Ctrl+Clicking a link
// which would open a new browser window.
document.addEventListener('click', (event) => event.preventDefault());

app().start(bridge().processArgv()).then((result) => {
	require('./gui/Root');
}).catch((error) => {
	const env = bridge().env();

	if (error.code == 'flagError') {

        // TODO: Add error code and message handling
		bridge().showErrorMessageBox(error.message);
	} else {
		// If something goes wrong at this stage we don't have a console or a log file
		// so display the error in a message box.
		const msg = ['Fatal error:', error.message];
		if (error.fileName) msg.push(error.fileName);
		if (error.lineNumber) msg.push(error.lineNumber);
		if (error.stack) msg.push(error.stack);

		if (env === 'dev') {
			console.error(error);
		} else {
			bridge().showErrorMessageBox(msg.join('\n\n'));
		}
	}

	// In dev, we leave the app open as debug statements in the console can be useful
	if (env !== 'dev') bridge().electronApp().exit(1);
});
