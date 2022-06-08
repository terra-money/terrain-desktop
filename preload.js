const { ipcRenderer } = require('electron');

window.ipcRenderer = ipcRenderer;
window.require = require;
