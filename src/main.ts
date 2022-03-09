import ElectronWrapper from './classes/ElectronWrapper'

// To enable hot reloading for easier front end development
const electronReload = require('electron-reload')
electronReload(__dirname, {})
require('@electron/remote/main').initialize()

// const { initBridge } = require('./bridge')

const app = new ElectronWrapper(process.argv)

// initBridge(app)

app.start().catch(error => {
  console.error('Electron app fatal error:', error)
})
