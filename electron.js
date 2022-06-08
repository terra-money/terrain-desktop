/* eslint-disable global-require */
const path = require('path');
const { WebSocketClient } = require('@terra-money/terra.js');
const { app, BrowserWindow } = require('electron');

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname);
// const isDev = require('electron-is-dev');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.maximize();

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);

  win.webContents.openDevTools({ mode: 'right' });

  const ws = new WebSocketClient('ws://localhost:26657/websocket');
  ws.subscribe('NewBlock', {}, ({ value }) => {
    win.webContents.send('NewBlock', value);
  });

  ws.start();
  // Open the DevTools.
  //   if (isDev) {
  //     win.webContents.openDevTools({ mode: 'detach' });
  //   }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname, {
  // Note that the path to electron may vary according to the main file
  // eslint-disable-next-line import/no-dynamic-require
  electron: require(path.join(__dirname, '/node_modules/electron')),
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
