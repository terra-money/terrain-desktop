/* eslint-disable global-require */
const path = require('path');
const { WebSocketClient } = require('@terra-money/terra.js');
const { app, BrowserWindow, dialog } = require('electron');
const Dockerode = require('dockerode');
const DockerodeCompose = require('dockerode-compose');

// const isDev = require('electron-is-dev');
const docker = new Dockerode();
let compose;
const ws = new WebSocketClient('ws://localhost:26657/websocket');
async function createWindow() {
  // Create the browser window.
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

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);

  win.webContents.openDevTools();
  // win.loadURL('http://localhost:3000');

  ws.subscribe('NewBlock', {}, ({ value }) => {
    win.webContents.send('NewBlock', value);
  });

  ws.start();
  // Open the DevTools.
  //   if (isDev) {
  //     win.webContents.openDevTools({ mode: 'detach' });
  //   }

  const { filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] });
  compose = new DockerodeCompose(docker, filePaths[0], 'terra');
  await compose.pull();
  const state = await compose.up();
  console.log(state);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  ws.destroy();
  console.log(compose);
  compose.down();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
