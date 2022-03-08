// // This is the initialization for the Electron RENDERER process
// TODO: Import react

import app from './app'

const bridge = require('@electron/remote').require('./bridge').default

console.info(`Environment: ${bridge().env()}`)

// TOOD: Init shim here if needed

// Disable drag and drop of links inside application (which would
// open it as if the whole app was a browser)
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

// Disable middle-click (which would open a new browser window, but we don't want this)
document.addEventListener('auxclick', event => event.preventDefault())

// Each link (rendered as a button or list item) has its own custom click event
// so disable the default. In particular this will disable Ctrl+Clicking a link
// which would open a new browser window.
document.addEventListener('click', (event) => event.preventDefault())

app().start(bridge().processArgv()).then((result) => {
  require('./gui/Root')
}).catch((error) => {
  const env = bridge().env()
  if (error.code === 'flagError') {
    // TODO: Add error code and message handling
    bridge().showErrorMessageBox(error.message)
  } else {
    // If something goes wrong at this stage we don't have a console or a log file
    // so display the error in a message box.
    const msg = ['Fatal error:', error.message]
    if (error.fileName) msg.push(error.fileName)
    if (error.lineNumber) msg.push(error.lineNumber)
    if (error.stack) msg.push(error.stack)

    if (env === 'dev') {
      console.error(error)
    } else {
      bridge().showErrorMessageBox(msg.join('\n\n'))
    }
  }
  // In dev, we leave the app open as debug statements in the console can be useful
  if (env !== 'dev') bridge().electronApp().exit(1)
})
