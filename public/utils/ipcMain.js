const { ipcMain } = require('electron');
const { validateIpcSender } = require('./misc');

const customIpcHandle = (...args) => {
  console.log('args', args[1]);
  console.log('WORK');
//   console.log('channel', channel);
//   ipcMain.handle(channel, listener);
};

ipcMain.customHandle = customIpcHandle;

module.exports = {
  ipcMain,
};
