const ipcRenderer = require('electron').ipcRenderer
export class Bridge {
  constructor () {
    // Wrap app with bridge
    ipcRenderer.on('appClose', this.onAppClose)
  }

  onAppClose () {
    const canClose = true
    // Do some clean up
    ipcRenderer.send('appCloseReply', {
      canClose: canClose
    })
  }

  async env (): Promise<string> {
    return await ipcRenderer.invoke('bridge:env')
  }

  processArgv () {
    return process.argv
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

    exit = (code = 0) => {
      ipcRenderer.send('bridge:exit', code)
    }
}

let bridge_: Bridge = null

function bridge () {
  if (!bridge_) bridge_ = new Bridge()
  return bridge_
}

export default bridge

// let bridge_: Bridge = null

// export function initBridge (wrapper: ElectronAppWrapper) {
//   if (bridge_) throw new Error('Bridge already initialized')
//   bridge_ = new Bridge(wrapper)
//   return bridge_
// }

// export default function bridge () : Bridge {
//   if (!bridge_) throw new Error('Bridge not initialized')
//   return bridge_
// }

// module.exports = {
// 	initBridge,
// 	bridge
// }

// module.exports = Bridge
