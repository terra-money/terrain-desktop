const settings = require('electron-settings');
const {
  dialog, app, ipcMain, BrowserWindow,
} = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { WebSocketClient } = require('@terra-money/terra.js');
const { promises: fs } = require('fs');
const yaml = require('js-yaml');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {
  LOCALTERRA_PATH_DIALOG, LOCALTERRA_STOP_DIALOG, LOCALTERRA_BAD_DIR_DIALOG,
} = require('./dialogs');


const isExiting = false;
let isStarted = false;

const blockWs = new WebSocketClient(process.env.LOCAL_TERRA_WS);
const txWs = new WebSocketClient(process.env.LOCAL_TERRA_WS);

async function validatePath(p) {
  const ltFile = await fs.readFile(`${p}/docker-compose.yml`, 'utf8');
  const { services, version } = yaml.load(ltFile); // we also have easy access to version here
  const ltServices = Object.keys(services); // could handle this in a bunch of diff ways
  return ltServices.includes('terrad');
}

async function createWindow(params) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    ...params,
  });
  return win;
}

async function getLocalTerraPath() {
  try {
    let ltPath = await settings.get('localTerraPath');
    if (!ltPath) {
      const { filePaths } = await dialog.showOpenDialog(LOCALTERRA_PATH_DIALOG);
      const isValid = await validatePath(filePaths[0]);
      if (isValid) {
        [ltPath] = filePaths;
        settings.set('localTerraPath', ltPath);
      }
    }
    return ltPath;
  } catch (err) {
    await dialog.showMessageBox(LOCALTERRA_BAD_DIR_DIALOG);
    startLocalTerra();
  }
}

async function startLocalTerra(win) {
  try { 
    const ltPath = await getLocalTerraPath();
    const compose = spawn('docker-compose', ['up'], { cwd: ltPath });
  
    compose.stdout.on('data', (data) => {
      win.webContents.send('NewLogs', data.toString());
      if (!isStarted && data.includes('indexed block')) {
        console.log('starting websocket');
        isStarted = true;
        blockWs.start();
        txWs.start();
        win.webContents.send('LocalTerra', true);
      }
    });
  
    compose.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
  
    ipcMain.on('LocalTerra', (_, shouldBeActive) => {
      if (shouldBeActive) {
        startLocalTerra(win);
      } else {
        stopLocalTerra(compose, win);
      }
    });
  
    compose.on('close', () => {
      win.webContents.send('LocalTerra', false);
      if (isExiting) {
        app.quit();
      } else {
        // dialog.showMessageBoxSync(LOCALTERRA_STOP_DIALOG);
        isStarted = false;
        // startLocalTerra();
      }
    });
    return compose;
  } catch (err) {
    console.log('err', err)
  }
}

async function installLocalTerra() {
  try {
    const ltPath = app.getPath('appData')
    await exec('git clone https://github.com/terra-money/LocalTerra.git --depth 1', { cwd: ltPath })
    await settings.set('localTerraPath', `${ltPath}/LocalTerra`);
  } catch (err) {
    console.log('err', err)
  }
}

async function stopLocalTerra(compose, win) {
  if (win) { win.webContents.send('LocalTerra', false); }
  txWs.destroy();
  blockWs.destroy();
  compose.kill();
}

module.exports = {
  startLocalTerra,
  stopLocalTerra,
  createWindow,
  blockWs,
  txWs,
  installLocalTerra
};
