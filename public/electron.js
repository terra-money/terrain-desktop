const path = require('path');
const settings = require('electron-settings');
const { app, shell, ipcMain } = require('electron');
const isDev = require('electron-is-dev')
require('dotenv').config()

const {
  startLocalTerra, stopLocalTerra, blockWs, txWs, createWindow, installLocalTerra
} = require('./utils');

async function init() {
  let win = await createWindow();
  const firstOpen = await settings.get('firstOpen');



  win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    win.webContents.openDevTools();
  }

  win.on('closed', () => { win = null });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (typeof firstOpen === 'undefined') {
    win.webContents.send('FirstOpen', true);
  }

  const compose = await startLocalTerra(win);

  txWs.subscribeTx({}, async ({ value }) => {
    win.webContents.send('Tx', value);
  });

  blockWs.subscribe('NewBlock', {}, ({ value }) => {
    win.webContents.send('NewBlock', value);
  });

  ipcMain.on('OnboardComplete', async () => {
    await settings.set('firstOpen', false);
  })

  ipcMain.on('installLocalTerra', async () => {
    await settings.set('firstOpen', false);
    await installLocalTerra()
  })

  app.on('window-all-closed', () => {
    stopLocalTerra(compose);
  });
}

settings.unsetSync('firstOpen');
settings.unsetSync('localTerraPath');
app.on('ready', init);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// Open the DevTools.
//   if (isDev) {
//     win.webContents.openDevTools({ mode: 'detach' });
//   }
