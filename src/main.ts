import ElectronWrapper from './classes/ElectronWrapper'

require('@electron/remote/main').initialize()

const app = new ElectronWrapper(process.argv)

app.start().catch(error => {
  console.error('Electron app fatal error:', error)
})
