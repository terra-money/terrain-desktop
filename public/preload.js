const { ipcRenderer } = require('electron');
const Store = require('electron-store');

window.ipcRenderer = ipcRenderer.setMaxListeners(1);
window.store = new Store();

