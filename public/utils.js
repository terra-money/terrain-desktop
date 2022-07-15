const { app } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { WebSocketClient } = require('@terra-money/terra.js');
const fs = require('fs');
const yaml = require('js-yaml');
const util = require('util');
const { Tx } = require('@terra-money/terra.js');

const { readMsg } = require('@terra-money/msg-reader');
const { showLocalTerraStartNotif, showLocalTerraStopNotif, showNoTerrainRefsDialog } = require('./messages');
const exec = util.promisify(require('child_process').exec);

const { LOCAL_TERRA_GIT, LOCAL_TERRA_WS } = require('./constants');

const txWs = new WebSocketClient(LOCAL_TERRA_WS);
const blockWs = new WebSocketClient(LOCAL_TERRA_WS);

let isLocalTerraRunning = false;

function validateLocalTerraPath(url) {
  try {
    const dockerComposePath = path.join(url, 'docker-compose.yml');
    const dockerComposeYml = fs.readFileSync(dockerComposePath, 'utf8');
    const { services } = yaml.load(dockerComposeYml); // All properties from docker-compose are available here
    const ltServices = Object.keys(services);
    return ltServices.includes('terrad');
  } catch (e) {
    return false;
  }
}

function validateRefsPath(refsPath) {
  try {
    return fs.existsSync(refsPath);
  } catch (e) {
    showNoTerrainRefsDialog();
    return false;
  }
}

async function downloadLocalTerra() {
  const LOCAL_TERRA_PATH = path.join(app.getPath('appData'), 'LocalTerra');
  if (fs.existsSync(LOCAL_TERRA_PATH)) {
    throw Error(`LocalTerra already exists under the path '${LOCAL_TERRA_PATH}'`);
  } else {
    await exec(`git clone ${LOCAL_TERRA_GIT} --depth 1`, { cwd: app.getPath('appData') });
  }
  return LOCAL_TERRA_PATH;
}

function startLocalTerra(localTerraPath) {
  return spawn('docker-compose', ['up'], { cwd: localTerraPath });
}

function getContractSchemas(projectDir, contractName) {
  try {
    const parsedSchemas = [];
    const schemaDir = path.join(projectDir, 'contracts', contractName, 'schema');
    const schemas = fs.readdirSync(schemaDir, 'utf8').filter((file) => file ==='query_msg.json' || file === 'execute_msg.json');

    schemas.forEach(file => {
      const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, file), 'utf8'));
      schema.msgType = schema.title;
      schema.anyOf.forEach((props) => {
        [schema.title] = Object.keys(props.properties);
        delete schema.anyOf;
        parsedSchemas.push({ ...schema, ...props });
      })
    })

    return parsedSchemas;
  } catch (e) {
    return null;
  }
}

function getSmartContractData(projectDir) {
  const p = path.join(projectDir, 'refs.terrain.json');
  if (validateRefsPath(p)) {
    return getContractDataFromRefs(projectDir, p);
  }
  showNoTerrainRefsDialog();
}

function getContractDataFromRefs(projectDir, refsPath) {
  try {
    const refsData = fs.readFileSync(refsPath, 'utf8');
    const { localterra } = JSON.parse(refsData);
    const contracts = Object.keys(localterra).map((name) => {
      const schemas = getContractSchemas(projectDir, name);
      return {
        name,
        path: projectDir,
        address: localterra[name].contractAddresses.default,
        codeId: localterra[name].codeId,
        schemas,
      }
    });
    return contracts;
  } catch {
    showNoTerrainRefsDialog();
  }
}

async function subscribeToLocalTerraEvents(localTerraProcess, win) {
  localTerraProcess.stdout.on('data', (data) => {
    if (win.isDestroyed()) return;

    win.webContents.send('NewLogs', data.toString());
    if (!isLocalTerraRunning && data.includes('indexed block')) {
      txWs.start();
      blockWs.start();
      isLocalTerraRunning = true;
      win.webContents.send('LocalTerraRunning', true);
      win.webContents.send('LocalTerraPath', true);
      showLocalTerraStartNotif();
    }
  });

  localTerraProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  localTerraProcess.on('close', () => {
    if (win.isDestroyed()) return;
    isLocalTerraRunning = false;
    win.webContents.send('LocalTerraRunning', false);
  });

  return localTerraProcess;
}

async function stopLocalTerra(localTerraProcess) {
  return new Promise((resolve) => {
    if (localTerraProcess.killed) {
      return resolve();
    }
    txWs.destroy();
    blockWs.destroy();
    localTerraProcess.once('close', resolve);
    localTerraProcess.kill();
    showLocalTerraStopNotif();
  });
}
const parseTxMsg = (encodedTx) => {
  const unpacked = Tx.unpackAny({
    value: Buffer.from(encodedTx, 'base64'),
    typeUrl: '',
  });
  return unpacked.body.messages[0];
};

const parseTxDescriptionAndMsg = (tx) => {
  const msg = parseTxMsg(tx);
  const description = readMsg(msg);
  return { msg: msg.toData(), description };
};

const setDockIconDisplay = (state, win) => {
  if (process.platform === 'darwin') {
    app.dock[state ? 'show' : 'hide']();
  } else {
    win.setSkipTaskbar(!!state);
  }
};

const isDockerRunning = async () => {
  try {
    await exec('docker ps');
    return true;
  } catch (err) {
    return false;
  }
};

const shutdown = async (localTerraProcess, win) => {
  win.hide();
  setDockIconDisplay(false, win);
  app.isQuitting = true;
  await stopLocalTerra(localTerraProcess);
  app.exit();
};

module.exports = {
  txWs,
  blockWs,
  isDockerRunning,
  stopLocalTerra,
  parseTxDescriptionAndMsg,
  startLocalTerra,
  downloadLocalTerra,
  parseTxMsg,
  validateLocalTerraPath,
  getSmartContractData,
  subscribeToLocalTerraEvents,
  setDockIconDisplay,
  shutdown,
};
