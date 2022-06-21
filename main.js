const path = require('path');
const settings = require('electron-settings');
const { app, shell } = require('electron');
const {
  startLocalTerra, stopLocalTerra, blockWs, txWs, createWindow,
} = require('./utils');

async function init() {
  const win = await createWindow();

  const firstOpen = await settings.get('firstOpen');

  if (typeof firstOpen === 'undefined') {
    win.hide();
    const splashWin = await createWindow();
    splashWin.webContents.openDevTools();
    splashWin.loadURL(`file://${path.join(__dirname, 'dist/onboarding.html')}`);
    return;
  }

  win.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.webContents.openDevTools();

  const compose = await startLocalTerra(win);

  txWs.subscribeTx({}, async ({ value }) => {
    win.webContents.send('Tx', value);
  });

  blockWs.subscribe('NewBlock', {}, ({ value }) => {
    win.webContents.send('NewBlock', value);
  });

  app.on('window-all-closed', () => {
    stopLocalTerra(compose);
  });
}

app.whenReady().then(init);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// Open the DevTools.
//   if (isDev) {
//     win.webContents.openDevTools({ mode: 'detach' });
//   }
