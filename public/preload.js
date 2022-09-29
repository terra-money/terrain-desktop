const { ipcRenderer } = require('electron');
const { store } = require('./utils/store');

// // const customIpcHandle = (channel, cb) => {
// //   console.log('WORKING');
// //   console.log('cb', cb);
// //   ipcMain.handle(channel, cb);
// // };

// const customIpcHandle = ipcMain.handle;
// ipcMain.handle = customIpcHandle;

window.ipcRenderer = ipcRenderer.setMaxListeners(1);
window.store = store;
