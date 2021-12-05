import { app as electronApp } from 'electron'
import ElectronWrapper from './classes/ElectronWrapper'
import Logger from './lib/Logger'
import FsDriverNode from './lib/FsDriverNode'
import { envFromArgs, profilePathFromArgs, isDebugMode } from './lib/startupHelpers'
import Setting from './models/Setting'

require('@electron/remote/main').initialize();
const { initBridge } = require('./bridge');

Logger.setFsDriver(new FsDriverNode())


const env = envFromArgs(process.argv)
const profilePath = profilePathFromArgs(process.argv)
const debugMode = isDebugMode(process.argv)

const app = new ElectronWrapper(electronApp, env, profilePath, debugMode)

initBridge(app)

app.start().catch(error => {
    console.error('Electron app fatal error:', error);
})