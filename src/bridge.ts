const ipcRenderer = require('electron').ipcRenderer
export class Bridge {
  constructor () {
    // Initialize listeners for events from main process
    ipcRenderer.on('appClose', this.appCloseReply)
  }

  appCloseReply () {
    const canClose = true
    // Do some clean up that could optionally say canClose is false
    ipcRenderer.send('bridge:appCloseReply', {
      canClose: canClose
    })
  }

  async env (): Promise<string> {
    return await ipcRenderer.invoke('bridge:env')
  }

  showMainWindow () {
    ipcRenderer.send('bridge:showMainWindow')
  }

  async showErrorMessageBox (message: string) {
    return await this.showMessageBox_({
      type: 'error',
      message: message,
      buttons: ['OK']
    })
  }

  async showMessageBox_ (options: any): Promise<number> {
    return await ipcRenderer.invoke('bridge:showMessageBox_', options)
  }

  exit (code = 0) {
    ipcRenderer.send('bridge:exit', code)
  }
}

let bridge_: Bridge | null = null

function bridge () {
  if (!bridge_) bridge_ = new Bridge()
  return bridge_
}

export default bridge
