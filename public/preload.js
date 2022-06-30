const { ipcRenderer } = require('electron');
const Store = require('electron-store');
require('dotenv').config()

window.ipcRenderer = ipcRenderer.setMaxListeners(1);
window.store = new Store();

