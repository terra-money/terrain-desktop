const { app } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { WebSocketClient } = require('@terra-money/terra.js');
const fs = require('fs');
const yaml = require('js-yaml');
const util = require('util');
const { showLocalTerraStartNotif, showLocalTerraStopNotif } = require('./messages');
const exec = util.promisify(require('child_process').exec);
const { store } = require('../store');
const { setDockIconDisplay } = require('./misc');

const {
  LOCAL_TERRA_GIT, LOCAL_TERRA_WS, LOCAL_TERRA_IS_RUNNING, LOCAL_TERRA_PATH_CONFIGURED, NEW_LOG,
} = require('../../src/constants');

const txWs = new WebSocketClient(LOCAL_TERRA_WS);
const blockWs = new WebSocketClient(LOCAL_TERRA_WS);

let isLocalTerraRunning = false;

const validateLocalTerraPath = (url) => {
  try {
    const dockerComposePath = path.join(url, 'docker-compose.yml');
    const dockerComposeYml = fs.readFileSync(dockerComposePath, 'utf8');
    const { services } = yaml.load(dockerComposeYml);
    const ltServices = Object.keys(services);
    return ltServices.includes('terrad');
  } catch (e) {
    return false;
  }
};

const downloadLocalTerra = async () => {
  const localTerraPath = path.join(app.getPath('appData'), 'LocalTerra');
  if (fs.existsSync(localTerraPath)) {
    throw Error(`LocalTerra already exists under the path '${localTerraPath}'`);
  } else {
    await exec(`git clone ${LOCAL_TERRA_GIT} --depth 1`, { cwd: app.getPath('appData') });
  }
  return localTerraPath;
};

const startLocalTerra = (localTerraPath) => exec('docker compose up -d --wait', { cwd: localTerraPath });

const subscribeToLocalTerraEvents = async (win) => {
  const localTerraPath = await store.getLocalTerraPath();
  const localTerraProcess = spawn('docker', ['compose', 'logs', '-f'], { cwd: localTerraPath });

  localTerraProcess.stdout.on('data', (data) => {
    if (win.isDestroyed()) return;

    console.log('isLocalTerraRunning in subscribeToLocalTerraEvents', isLocalTerraRunning);

    win.webContents.send(NEW_LOG, data.toString());
    if (!isLocalTerraRunning) {
      console.log('INSIDE !isLocalTerraRunning IF');
      txWs.start();
      blockWs.start();
      isLocalTerraRunning = true;
      win.webContents.send(LOCAL_TERRA_IS_RUNNING, true);
      win.webContents.send(LOCAL_TERRA_PATH_CONFIGURED, true);
      showLocalTerraStartNotif();
    }
  });
  localTerraProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  localTerraProcess.on('close', () => {
    if (win.isDestroyed()) return;
    isLocalTerraRunning = false;
    win.webContents.send(LOCAL_TERRA_IS_RUNNING, false);
  });
  return localTerraProcess;
};

const stopLocalTerra = async (localTerraProcess) => {
  const localTerraPath = await store.getLocalTerraPath();
  if (localTerraProcess.killed) {
    console.log('process already killed');
    return;
  }
  txWs.destroy();
  blockWs.destroy();

  await exec('docker compose stop', { cwd: localTerraPath });

  isLocalTerraRunning = false;
  showLocalTerraStopNotif();
};

const shutdown = async (localTerraProcess, win, restart = false) => {
  win.hide();
  setDockIconDisplay(false, win);
  app.isQuitting = true;
  await stopLocalTerra(localTerraProcess);
  if (restart) {
    app.relaunch();
  }
  app.exit();
};
const isDockerRunning = async () => {
  try {
    await exec('docker ps');
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  txWs,
  blockWs,
  isDockerRunning,
  stopLocalTerra,
  startLocalTerra,
  downloadLocalTerra,
  validateLocalTerraPath,
  subscribeToLocalTerraEvents,
  shutdown,
};
