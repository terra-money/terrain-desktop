const settings = require('electron-settings');
const { dialog, app, ipcMain } = require('electron');
const { spawn } = require('child_process');
const { WebSocketClient } = require('@terra-money/terra.js');
const { promises: fs } = require('fs');
const yaml = require('js-yaml');
const {
  LOCALTERRA_PATH_DIALOG, LOCALTERRA_STOP_DIALOG, LOCAL_WS, LOCALTERRA_BAD_DIR_DIALOG,
} = require('./constants');

const isExiting = false;
let isStarted = false;

const blockWs = new WebSocketClient(LOCAL_WS);
const txWs = new WebSocketClient(LOCAL_WS);

async function validatePath(path) {
  const ltFile = await fs.readFile(`${path}/docker-compose.yml`, 'utf8');
  const { services, version } = yaml.load(ltFile); // we also have easy access to version here
  const ltServices = Object.keys(services); // could handle this in a bunch of diff ways
  return ltServices.includes('terrad');
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
  const ltPath = await getLocalTerraPath();
  const compose = spawn('docker-compose', ['up'], { cwd: ltPath });

  compose.stdout.on('data', (data) => {
    // win.webContents.send('NewLogs', data.toString());
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
    console.log('shouldBeActive', shouldBeActive);
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
}

async function stopLocalTerra(compose, win) {
  try {
    if (win) { win.webContents.send('LocalTerra', false); }
    txWs.destroy();
    blockWs.destroy();
    compose.kill();
  } catch (err) {
    console.log('err', err);
  }
}

module.exports = {
  startLocalTerra,
  stopLocalTerra,
  blockWs,
  txWs,
};
