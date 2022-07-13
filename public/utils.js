const { app } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { WebSocketClient } = require('@terra-money/terra.js');
const fs = require('fs');
const yaml = require('js-yaml');
const util = require('util');
const { Tx } = require('@terra-money/terra.js');

const { readMsg } = require('@terra-money/msg-reader');
const execSync = require('child_process').exec;
const { showLocalTerraStartNotif, showLocalTerraStopNotif, showNoTerrainRefsDialog, showStartDockerDialog } = require('./messages');
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
    console.log('Error validating path', e);
    return false;
  }
}

function validateTerraSmartContract(refsPath) {
  try {
    return fs.existsSync(refsPath);
  } catch (e) {
    showNoTerrainRefsDialog()
    return false;
  }
}

async function downloadLocalTerra() {
  const LOCAL_TERRA_PATH = path.join(app.getPath('appData'), "LocalTerra");
  if (fs.existsSync(LOCAL_TERRA_PATH)) {
    throw Error(`LocalTerra already exists under the path '${LOCAL_TERRA_PATH}'`);
  } else {
    await exec(`git clone ${LOCAL_TERRA_GIT} --depth 1`, { cwd: app.getPath('appData') })
  }
  return LOCAL_TERRA_PATH;
}

function startLocalTerra(localTerraPath) {
  try {
    return spawn('docker-compose', ['up'], { cwd: localTerraPath });
  } catch (err) {
    console.log('err', err)
    showStartDockerDialog();
    return false
  }
}

function getSmartContractRefs(projectDir) {
  const refsPath = path.join(projectDir, 'refs.terrain.json');
  if (validateTerraSmartContract(refsPath)) {
    return smartContractFromRefs(projectDir, refsPath);
  }
  showNoTerrainRefsDialog();
}

function smartContractFromRefs(projectDir, refsPath) {
  try {
    const refsData = fs.readFileSync(refsPath, 'utf8');
    const { localterra } = JSON.parse(refsData);

    return Object.keys(localterra).map((name) =>
    ({
      name,
      path: projectDir,
      address: localterra[name].contractAddresses.default,
      codeId: localterra[name].codeId,
    })
    );
  } catch {
    showNoTerrainRefsDialog();
  }
}

async function subscribeToLocalTerraEvents(localTerraProcess, win) {
  localTerraProcess.stdout.on('data', (data) => {
    if (win.isDestroyed()) return

    win.webContents.send('NewLogs', data.toString());
    if (!isLocalTerraRunning && data.includes('indexed block')) {
      txWs.start();
      blockWs.start();
      isLocalTerraRunning = true;
      win.webContents.send('LocalTerraRunning', true);
      win.webContents.send('LocalTerraPath', true);
      showLocalTerraStartNotif()
    }
  });

  localTerraProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  localTerraProcess.on('close', () => {
    if (win.isDestroyed()) return
    isLocalTerraRunning = false;
    win.webContents.send('LocalTerraRunning', false);
  });

  return localTerraProcess;
}

async function stopLocalTerra(localTerraProcess) {
  console.log('localTerraProcess.killed', localTerraProcess.killed)
  return new Promise(resolve => {
    if (localTerraProcess.killed) {
      return resolve();
    }
    console.log('after kill')
    txWs.destroy();
    blockWs.destroy();
    localTerraProcess.once('close', resolve);
    localTerraProcess.kill();
    showLocalTerraStopNotif()
  });
}
const parseTxMsg = (encodedTx) => {
  const unpacked = Tx.unpackAny({
    value: Buffer.from(encodedTx, 'base64'),
    typeUrl: '',
  });;
  return unpacked.body.messages[0];
};

const parseTxDescriptionAndMsg = (tx) => {
  const msg = parseTxMsg(tx);
  const description = readMsg(msg);
  return { msg: msg.toData(), description };
};

const isDockerRunning = async () => {
  try {
    await exec('docker ps')
    return true;
  } catch (err) {
    return false;
  }
}

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
  getSmartContractRefs,
  subscribeToLocalTerraEvents
};
