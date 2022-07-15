const { ipcRenderer } = require('electron');
const { store } = require('./store');

window.ipcRenderer = ipcRenderer.setMaxListeners(1);
window.store = store;
