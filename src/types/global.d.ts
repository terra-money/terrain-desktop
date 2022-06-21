import { IpcRenderer } from 'electron';

export {};
declare global {
  export interface Window {
    ipcRenderer: IpcRenderer
    api: any
  }
}
