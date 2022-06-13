/* eslint-disable global-require */
const path = require('path');
const { WebSocketClient } = require('@terra-money/terra.js');
const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');

let compose;
let exiting = false;
let started = false;
const ws = new WebSocketClient('ws://localhost:26657/websocket');

// start localTerra node
async function startLocalTerra(filePath) {
  compose = spawn('docker-compose', ['up'], { cwd: filePath });

  compose.stdout.on('data', (data) => {
    if (!started && data.includes('indexed block')) {
      console.log('starting websocket');
      started = true;
      ws.start();
    }
  });

  compose.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  compose.on('close', () => {
    if (exiting) {
      app.quit();
    } else {
      dialog.showMessageBoxSync({ message: 'LocalTerra has stopped. Now restarting...', title: 'Terrarium', type: 'warning' });
      started = false;
      startLocalTerra(filePath);
    }
  });
}

// stop localTerra node
async function stopLocalTerra() {
  ws.destroy();
  compose.kill();
}

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
  // win.loadFile('index.html');
  win.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);

  win.webContents.openDevTools();
  // win.loadURL('http://localhost:3000');

  ws.subscribe('NewBlock', {}, ({ value }) => {
    win.webContents.send('NewBlock', value);
  });

  // Open the DevTools.
  //   if (isDev) {
  //     win.webContents.openDevTools({ mode: 'detach' });
  //   }

  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  startLocalTerra(filePaths[0]);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  exiting = true;
  stopLocalTerra();
});
