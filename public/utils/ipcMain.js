const { ipcMain } = require('electron');
const { validateIpcSender } = require('./misc');

const secureHandle = (channel, listener) => {
  const secureListener = (event, ...args) => {
    if (!validateIpcSender(event.senderFrame)) return null;
    return listener(event, ...args);
  };
  ipcMain.handle(channel, secureListener);
};

ipcMain.secureHandle = secureHandle;

module.exports = { ipcMain };
