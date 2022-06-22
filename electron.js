const path = require('path');
const settings = require('electron-settings');
const { app, shell, ipcMain } = require('electron');
const {
  startLocalTerra, stopLocalTerra, blockWs, txWs, createWindow, installLocalTerra
} = require('./utils');


async function init() {
  const appWin = await createWindow();
  let splashWin

  ipcMain.on('onboardComplete', async () => {
    await settings.set('firstOpen', false);
    splashWin && splashWin.close()
    appWin.show()
    init()
  })

  ipcMain.on('installLocalTerra', async () => {
    await installLocalTerra()
  })

  const firstOpen = await settings.get('firstOpen');

  if (typeof firstOpen === 'undefined') {
    appWin.hide();
    splashWin = await createWindow({ frame: false });
    splashWin.webContents.openDevTools();
    splashWin.loadURL(`file://${path.join(__dirname, 'dist/onboarding.html')}`);
    return;
  }

  appWin.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);

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
app.whenReady().then(init);



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// Open the DevTools.
//   if (isDev) {
//     appWin.webContents.openDevTools({ mode: 'detach' });
//   }
