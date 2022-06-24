const { app } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { WebSocketClient } = require('@terra-money/terra.js');
const fs = require('fs');
const yaml = require('js-yaml');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const blockWs = new WebSocketClient(process.env.LOCAL_TERRA_WS);
const txWs = new WebSocketClient(process.env.LOCAL_TERRA_WS);

let isLocalTerraRunning = false;

function validateLocalTerraPath(url) {
  try {
    const dockerComposePath = path.join(url, 'docker-compose.yml');
    const dockerComposeYml = fs.readFileSync(dockerComposePath, 'utf8');
    const { services } = yaml.load(dockerComposeYml); // All properties from docker-compose are available here
    const ltServices = Object.keys(services);
    return ltServices.includes('terrad');
  }
  catch (e) {
    console.log(e);
    return false;
  }
}

async function downloadLocalTerra() {
  const LOCAL_TERRA_PATH = path.join(app.getPath('appData'), "LocalTerra");
  if (fs.existsSync(LOCAL_TERRA_PATH)) {
    throw Error(`LocalTerra already exists under the path '${LOCAL_TERRA_PATH}'`);
  }
  else {
    await exec('git clone https://github.com/terra-money/LocalTerra.git --depth 1', { cwd: app.getPath('appData') })
  }
  return LOCAL_TERRA_PATH;
}

function startLocalTerra(localTerraPath) {
  return spawn('docker-compose', ['up'], { cwd: localTerraPath });
}

async function subscribeToLocalTerraEvents(localTerraProcess, browserWindow) {
  localTerraProcess.stdout.on('data', (data) => {
    browserWindow.webContents.send('NewLogs', data.toString());

    if (!isLocalTerraRunning && data.includes('indexed block')) {
      console.log('starting websocket');
      blockWs.start();
      txWs.start();
      isLocalTerraRunning = true;
      browserWindow.webContents.send('LocalTerraStatusChanged', {
        isActive: true,
        isPathConfigured: true
      });
    }
  });

  localTerraProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  localTerraProcess.on('close', () => {
    console.log('LocalTerra process closed');
    isLocalTerraRunning = false;
  });

  return localTerraProcess;
}

async function stopLocalTerra(localTerraProcess) {
  txWs.destroy();
  blockWs.destroy();
  localTerraProcess.kill();
}

module.exports = {
  txWs,
  blockWs,
  stopLocalTerra,
  startLocalTerra,
  downloadLocalTerra,
  validateLocalTerraPath,
  subscribeToLocalTerraEvents,
};
