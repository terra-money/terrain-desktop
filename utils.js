const settings = require('electron-settings');
const { dialog, app } = require('electron');
const { spawn } = require('child_process');
const { WebSocketClient } = require('@terra-money/terra.js');
const {
  LOCALTERRA_PATH_DIALOG, LOCALTERRA_STOP_DIALOG, LOCAL_WS,
} = require('./constants');

let compose;
const isExiting = false;
let isStarted = false;

const blockWs = new WebSocketClient(LOCAL_WS);
const txWs = new WebSocketClient(LOCAL_WS);

async function getLocalTerraPath() {
  let ltPath = await settings.get('localTerraPath');
  if (!ltPath) {
    const { filePaths } = await dialog.showOpenDialog(LOCALTERRA_PATH_DIALOG);
    ltPath = await settings.set('localTerraPath', filePaths[0]);
  }
  return ltPath;
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
  return compose;
}

module.exports = {
  startLocalTerra,
  blockWs,
  txWs,
};
