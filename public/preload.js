const { ipcRenderer } = require('electron');

window.ipcRenderer = ipcRenderer.setMaxListeners(1);