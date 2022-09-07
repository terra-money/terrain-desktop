const { ipcRenderer } = require('electron');
const { store } = require('./utils/store');

window.ipcRenderer = ipcRenderer.setMaxListeners(1);
window.store = store;
