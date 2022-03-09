const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onAppClose: (callback) => ipcRenderer.on('appClose', callback)
})
