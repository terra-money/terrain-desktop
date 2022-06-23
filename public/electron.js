const path = require('path');
const settings = require('electron-settings');
const { app, shell, ipcMain } = require('electron');
const isDev = require('electron-is-dev')
require('dotenv').config()

const {
  startLocalTerra, stopLocalTerra, blockWs, txWs, createWindow, installLocalTerra
} = require('./utils');

let appWin
let splashWin

async function init() {
  appWin = await createWindow();

  ipcMain.on('onboardComplete', async () => {
    await settings.set('firstOpen', false);
    splashWin.close()
    init()
  })

  ipcMain.on('installLocalTerra', async () => {
    await settings.set('firstOpen', false);
    splashWin.close()
    await installLocalTerra()
    init()
  })

  const firstOpen = await settings.get('firstOpen');

  if (typeof firstOpen === 'undefined') {
    appWin.hide();
    splashWin = await createWindow({ frame: false });
    splashWin.webContents.openDevTools();
    // splashWin.loadURL(`file://${path.join(__dirname, 'onboarding.html')}`);
    splashWin.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/onboarding.html')}`);
    return;
  }

  appWin.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    appWin.webContents.openDevTools();
  }

  appWin.on('closed', () => { appWin = null });

  appWin.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  appWin.webContents.openDevTools();

  const compose = await startLocalTerra(appWin);

  txWs.subscribeTx({}, async ({ value }) => {
    appWin.webContents.send('Tx', value);
  });

  blockWs.subscribe('NewBlock', {}, ({ value }) => {
    appWin.webContents.send('NewBlock', value);
  });

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
//     appWin.webContents.openDevTools({ mode: 'detach' });
//   }
