// import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { app as electronApp, BrowserWindow, screen, ipcMain, dialog } from 'electron'

const url = require('url')
const path = require('path')
// const { dirname } = require('@stoic/lib/path-utils');
// const fs = require('fs-extra')
// const { ipcMain } = require('electron');

interface RendererProcessQuitReply {
      canClose: boolean;
}

let mainWindow

export default class ElectronApp {
    private electronApp_: any;
    private args_: string[];
    private tray_: any = null;
    private willQuitApp_: boolean = false;
    private rendererProcessQuitReply_: RendererProcessQuitReply = null;

    constructor (args) {
      this.electronApp_ = electronApp
      this.args_ = args
    }

    async start () {
      // Since we are doing other async things before creating the window, we might miss
      // the "ready" event. So we use the function below to make sure that the app is ready.
      await this.waitForElectronAppReady()

      if (this.isAlreadyRunning()) return

      await this.enableHotReload()
      // await this.installDeveloperExtensions()

      this.createWindow()

      this.electronApp().on('before-quit', () => {
        this.willQuitApp_ = true
      })

      this.electronApp().on('window-all-closed', () => {
        this.electronApp_.quit()
      })

      this.electronApp().on('activate', () => {
        mainWindow.show()
      })
    }

    get isDebugMode () {
      return !!this.args_ && this.args_.indexOf('--debug') >= 0
    }

    get profilePath () {
      if (!this.args_) return null
      const profileIndex = this.args_.indexOf('--profile')
      if (profileIndex <= 0 || profileIndex >= this.args_.length - 1) return null
      const profileValue = this.args_[profileIndex + 1]
      return profileValue || null
    }

    get env () {
      if (!this.args_) return 'prod'
      const envIndex = this.args_.indexOf('--env')
      const devIndex = this.args_.indexOf('dev')
      if (envIndex === devIndex - 1) return 'dev'
      return 'prod'
    }

    async installDeveloperExtensions () {
      const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer')

      const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]
      await Promise.all(
        extensions.map((extension) => installExtension(extension, { loadExtensionOptions: { allowFileAccess: true } })
          .then((name) => console.log('Added Extension: ' + name))
          .catch((err) => console.log('An error occurred: ', err)))
      )
    }

    async enableHotReload () {
    // To enable hot reloading for easier front end development
      const electronReload = require('electron-reload')
      electronReload(path.join(__dirname, '..'), {})
    }

    electronApp () {
      return this.electronApp_
    }

    async waitForElectronAppReady () {
      if (this.electronApp().isReady()) {
        return Promise.resolve()
      }

      return new Promise((resolve) => {
        const iid = setInterval(() => {
          if (this.electronApp().isReady()) {
            clearInterval(iid)
            resolve(null)
          }
        }, 10)
      })
    }

    isAlreadyRunning () {
      if (this.env === 'dev') return false

      const gotTheLock = this.electronApp_.requestSingleInstanceLock()

      if (!gotTheLock) {
        // Another instance is already running - exit
        this.electronApp_.quit()
        return true
      }

      // Someone tried to open a second instance - focus our window instead
      this.electronApp_.on('second-instance', () => {
        const win = this.window()
        if (!win) return
        if (win.isMinimized()) win.restore()
        win.show()
        win.focus()
      })

      return false
    }

    createWindow () {
      const primaryDisplay = screen.getPrimaryDisplay()
      const { width, height } = primaryDisplay.workAreaSize

      const stateOptions: any = {
        defaultWidth: Math.round(0.8 * width),
        defaultHeight: Math.round(0.8 * height),
        file: `window-state-${this.env}.json`
      }

      if (this.profilePath) stateOptions.path = this.profilePath

      const windowStateKeeper = require('electron-window-state')

      // Load the previous state with fallback to defaults
      const windowState = windowStateKeeper(stateOptions)

      const windowOptions: any = {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        minWidth: 100,
        minHeight: 100,
        backgroundColor: '#fff', // required to enable sub pixel rendering, can't be in css
        webPreferences: {
          contextIsolation: false,
          nodeIntegration: true,
          enableRemoteModule: true
          // preload: path.join(__dirname, '..', 'preload.js')
        },
        webviewTag: true,
        // We start with a hidden window, which is then made visible depending on the showTrayIcon setting
        // https://github.com/laurent22/stoic/issues/2031
        show: (this.env === 'dev' || this.isDebugMode)
      }

      mainWindow = new BrowserWindow(windowOptions)

      if (!screen.getDisplayMatching(mainWindow.getBounds())) {
        const { width: windowWidth, height: windowHeight } = mainWindow.getBounds()
        const { width: primaryDisplayWidth, height: primaryDisplayHeight } = screen.getPrimaryDisplay().workArea
        mainWindow.setPosition(primaryDisplayWidth / 2 - windowWidth, primaryDisplayHeight / 2 - windowHeight)
      }

      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '..', 'index.html'),
        protocol: 'file:',
        slashes: true
      }))

      // Note that on Windows, calling openDevTools() too early results in a white window with no error message.
      // Waiting for one of the ready events might work but they might not be triggered if there's an error, so
      // the easiest is to use a timeout. Keep in mind that if you get a white window on Windows it might be due
      // to this line though.
      if (this.env === 'dev' || this.isDebugMode) {
        setTimeout(() => {
          try {
            mainWindow.webContents.openDevTools()
          } catch (error) {
            // This will throw an exception "Object has been destroyed" if the app is closed
            // in less that the timeout interval. It can be ignored.
            console.warn('Error opening dev tools', error)
          }
        }, 3000)
      }

      mainWindow.on('close', (event: any) => {
        console.log('Close event fired for ', process.platform)
        // If it's on macOS, the app is completely closed only if the user chooses to close the app (willQuitApp_ will be true)
        // otherwise the window is simply hidden, and will be re-open once the app is "activated" (which happens when the
        // user clicks on the icon in the task bar).

        // On Windows and Linux, the app is closed when the window is closed *except* if the tray icon is used. In which
        // case the app must be explicitly closed with Ctrl+Q or by right-clicking on the tray icon and selecting "Exit".

        let isGoingToExit = false

        if (process.platform === 'darwin') {
        // The production behaviour in macOS is replaced by close on exit for development work
          if (this.isDebugMode || this.willQuitApp_) {
            isGoingToExit = true
          } else {
            event.preventDefault()
            this.hide()
          }
        } else {
          if (this.trayShown() && !this.willQuitApp_) {
            event.preventDefault()
            mainWindow.hide()
          } else {
            isGoingToExit = true
          }
        }

        if (isGoingToExit) {
          if (!this.rendererProcessQuitReply_) {
            // If we haven't notified the renderer process yet, do it now
            // so that it can tell us if we can really close the app or not.
            // Search for "appClose" event for closing logic on renderer side.
            event.preventDefault()
            mainWindow.webContents.send('appClose')
          } else {
            // If the renderer process has responded, check if we can close or not
            if (this.rendererProcessQuitReply_.canClose) {
            // Really quit the app
              this.rendererProcessQuitReply_ = null
              mainWindow = null
            } else {
            // Wait for renderer to finish task
              event.preventDefault()
              this.rendererProcessQuitReply_ = null
            }
          }
        }
      })

      ipcMain.on('bridge:appCloseReply', (_event, value) => {
        this.rendererProcessQuitReply_ = value
        this.electronApp_.quit()
      })

      ipcMain.on('bridge:showMainWindow', () => {
        mainWindow.show()
      })
      ipcMain.on('bridge:exit', (_event, code) => {
        this.electronApp().exit(code)
      })

      ipcMain.handle('bridge:env', () => this.env)

      ipcMain.handle('bridge:showMessageBox_', (_event, value) => {
        return dialog.showMessageBoxSync(this.window(), value)
      })

      // ipcMain.on('asynchronous-message', (_event: any, message: string, args: any) => {
      //   if (message === 'appCloseReply') {
      //   // We got the response from the renderer process:
      //   // save the response and try quit again.
      //     this.rendererProcessQuitReply_ = args
      //     this.electronApp_.quit()
      //   }
      // })

      // Let us register listeners on the window, so we can update the state
      // automatically (the listeners will be removed when the window is closed)
      // and restore the maximized or full screen state
      windowState.manage(mainWindow)

      // HACK: Ensure the window is hidden, as `windowState.manage` may make the window
      // visible with isMaximized set to true in window-state-${this.env_}.json.
      // https://github.com/laurent22/stoic/issues/2365
      if (!windowOptions.show) {
        mainWindow.hide()
      }
    }

    window () {
      return mainWindow
    }

    // This method is used in macOS only to hide the whole app (and not just the main window)
    // including the menu bar. This follows the macOS way of hiding an app.
    hide () {
      this.electronApp_.hide()
    }

    trayShown () {
      return !!this.tray_
    }
}
