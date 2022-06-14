const path = require('path');
const { WebSocketClient } = require('@terra-money/terra.js');
const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const settings = require('electron-settings');

let compose;
let isExiting = false;
let isStarted = false;

const blockWs = new WebSocketClient('ws://localhost:26657/websocket');
const txWs = new WebSocketClient('ws://localhost:26657/websocket');

const LOCALTERRA_PATH_DIALOG = { message: 'Select your LocalTerra directory.', type: 'info', properties: ['openDirectory'] };
const LOCALTERRA_STOP_DIALOG = { message: 'LocalTerra stopped. Restarting...', title: 'Terrarium', type: 'warning' };
// const LOCALTERRA_BAD_DIR_DIALOG = { message: 'Please select the correct LocalTerra directory', title: 'Terrarium', type: 'warning' };

async function getLocalTerraPath() {
  let ltPath = await settings.get('localTerraPath');
  if (!ltPath) {
    const { filePaths } = await dialog.showOpenDialog(LOCALTERRA_PATH_DIALOG);
    ltPath = await settings.set('localTerraPath', filePaths[0]);
  }
  return ltPath;

  // const isValidLocalTerra = ltPath.path.match(/([^/]*)\/*$/)[1] === 'LocalTerra';
  // if (!isValidLocalTerra) {
  //   dialog.showMessageBoxSync(LOCALTERRA_BAD_DIR_DIALOG);
  //   getLocalTerraPath();
  //   return {};
  // }
}

async function startLocalTerra() {
  const ltPath = await getLocalTerraPath();
  compose = spawn('docker-compose', ['up'], { cwd: ltPath });

  compose.stdout.on('data', (data) => {
    if (!isStarted && data.includes('indexed block')) {
      console.log('starting websocket');
      isStarted = true;
      blockWs.start();
      txWs.start();
    }
  });

  compose.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  compose.on('close', () => {
    if (isExiting) {
      app.quit();
    } else {
      dialog.showMessageBoxSync(LOCALTERRA_STOP_DIALOG);
      isStarted = false;
      startLocalTerra();
    }
  });
}

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

  win.webContents.openDevTools();

  startLocalTerra();

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
  isExiting = true;
  compose.kill();
});

// Open the DevTools.
//   if (isDev) {
//     win.webContents.openDevTools({ mode: 'detach' });
//   }
