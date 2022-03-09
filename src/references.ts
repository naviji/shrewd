export interface IElectronAPI {
    onAppClose: () => Promise<void>,
  }

declare global {
    interface Window {
        electronAPI: any
    }
}
