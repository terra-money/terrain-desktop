const path = require('path');
const { app, BrowserWindow, shell } = require('electron');
const {
  startLocalTerra, stopLocalTerra, blockWs, txWs,
} = require('./utils');

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

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

app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// Open the DevTools.
//   if (isDev) {
//     win.webContents.openDevTools({ mode: 'detach' });
//   }
