const path = require('path');
const { app, BrowserWindow, shell } = require('electron');
const { startLocalTerra, blockWs, txWs } = require('./utils');

let compose;

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

  compose = startLocalTerra();

  txWs.subscribeTx({}, async ({ value }) => {
    win.webContents.send('Tx', value);
  });

  blockWs.subscribe('NewBlock', {}, ({ value }) => {
    win.webContents.send('NewBlock', value);
  });
}

app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  txWs.destroy();
  blockWs.destroy();
  compose.kill();
});

// Open the DevTools.
//   if (isDev) {
//     win.webContents.openDevTools({ mode: 'detach' });
//   }
