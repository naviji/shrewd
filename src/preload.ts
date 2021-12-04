import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('app', {
    env: () => ipcRenderer.sendSync("env"),
    debugMode: () => ipcRenderer.sendSync("debugMode")
})

// const _bridge = Bridge.instance()
// const api = {}

/*
 Classes imported here like Bridge will be completely separate from main.ts and hence
 won't have values assigned there. 

 This script is running in a separate process. It's just that its priviledges are higher
 than the rendered process and hence it is able to access some core node functions.

*/

// Object.getOwnPropertyNames(_bridge).forEach(p =>  {
//   if (typeof _bridge[p] === 'function') {
//     api[p] = _bridge[p]
//   }
// })

// const API = {
//   a: () => Test.a,
//   b: () => Test.b
// }

// console.log('preload', Bridge.instance().env())
// contextBridge.exposeInMainWorld('api', API)
