import ElectronApp from './classes/ElectronWrapper'

const app = new ElectronApp(process.argv)

app.start().catch(error => {
  console.error('Electron app fatal error:', error)
})
