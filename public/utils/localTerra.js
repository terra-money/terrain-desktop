const { app } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { WebSocketClient } = require('@terra-money/terra.js');
const fs = require('fs');
const yaml = require('js-yaml');
const util = require('util');
const waitOn = require('wait-on');
const exec = util.promisify(require('child_process').exec);
const { showLocalTerraStartNotif, showLocalTerraStopNotif, showTxOccuredNotif } = require('./messages');
const { store } = require('../store');
const { setDockIconDisplay, parseTxDescriptionAndMsg } = require('./misc');
const globals = require('./globals');

const {
  LOCAL_TERRA_GIT,
  LOCAL_TERRA_WS,
  LOCAL_TERRA_IS_RUNNING,
  LOCAL_TERRA_PATH_CONFIGURED,
  NEW_LOG,
  NEW_BLOCK,
  TX,
} = require('../../src/constants');

let txWs = new WebSocketClient(LOCAL_TERRA_WS);
let blockWs = new WebSocketClient(LOCAL_TERRA_WS);

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
    await exec(`git clone ${LOCAL_TERRA_GIT} --depth 1`, {
      cwd: app.getPath('appData'),
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`,
      },
    });
    await startLocalTerra(localTerraPath);
  }
  return localTerraPath;
};

const startLocalTerra = (localTerraPath) => {
  exec('docker compose up -d --wait', {
    cwd: localTerraPath,
    env: {
      PATH: `${process.env.PATH}:/usr/local/bin/`,
    },
  });
  return waitOn({ resources: ['http://localhost:26657'] });
};

const subscribeToLocalTerraEvents = async (win) => {
  const localTerraPath = await store.getLocalTerraPath();
  const localTerraProcess = spawn('docker', ['compose', 'logs', '-f'], {
    cwd: localTerraPath,
    env: {
      PATH: `${process.env.PATH}:/usr/local/bin/`,
    },
  });

  txWs = new WebSocketClient(LOCAL_TERRA_WS);
  blockWs = new WebSocketClient(LOCAL_TERRA_WS);

  localTerraProcess.stdout.on('data', async (data) => {
    if (win.isDestroyed()) return;

    win.webContents.send(NEW_LOG, data.toString());
    if (!globals.localTerra.isRunning) {
      txWs.subscribeTx({}, async ({ value }) => {
        const { description, msg } = parseTxDescriptionAndMsg(value.TxResult.tx);
        win.webContents.send(TX, { description, msg, ...value });
        showTxOccuredNotif(description);
      });

      blockWs.subscribe(NEW_BLOCK, {}, ({ value }) => {
        win.webContents.send(NEW_BLOCK, value);
      });

      txWs.start();
      blockWs.start();

      globals.localTerra.isRunning = true;
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
    globals.localTerra.isRunning = false;
    win.webContents.send(LOCAL_TERRA_IS_RUNNING, false);
  });
  return localTerraProcess;
};

const stopLocalTerra = async () => {
  const localTerraPath = await store.getLocalTerraPath();
  if (globals.localTerra.process.killed) {
    console.log('process already killed');
    return;
  }
  txWs.destroy();
  blockWs.destroy();

  await exec('docker compose stop', {
    cwd: localTerraPath,
    env: {
      PATH: `${process.env.PATH}:/usr/local/bin/`,
    },
  });

  globals.localTerra.isRunning = false;
  showLocalTerraStopNotif();
};

const shutdown = async (win, restart = false) => {
  try {
    win.hide();
    setDockIconDisplay(false, win);
    app.isQuitting = true;
    await stopLocalTerra();
    if (restart) {
      app.relaunch();
    }
    app.exit();
  } catch (err) {
    console.log('err', err);
    app.exit();
  }
};

const isDockerRunning = async () => {
  try {
    await exec('docker ps', {
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`,
      },
    });
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
