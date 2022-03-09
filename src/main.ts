import ElectronWrapper from './classes/ElectronWrapper'

require('@electron/remote/main').initialize()

const { initBridge } = require('./bridge')

const app = new ElectronWrapper(process.argv)

initBridge(app)

app.start().catch(error => {
  console.error('Electron app fatal error:', error)
})
