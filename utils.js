const settings = require('electron-settings');
const { dialog, app } = require('electron');
const { spawn } = require('child_process');
const { WebSocketClient } = require('@terra-money/terra.js');
const { promises: fs } = require('fs');
const yaml = require('js-yaml');

const {
  LOCALTERRA_PATH_DIALOG, LOCALTERRA_STOP_DIALOG, LOCAL_WS, LOCALTERRA_BAD_DIR_DIALOG,
} = require('./constants');

let compose;
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
      // dialog.showMessageBoxSync(LOCALTERRA_STOP_DIALOG);
      isStarted = false;
      // startLocalTerra();
    }
  });
  return compose;
}

module.exports = {
  startLocalTerra,
  blockWs,
  txWs,
};
