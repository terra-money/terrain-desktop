const path = require('path');
const Store = require('electron-store');
const { app, shell, ipcMain, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev')
require('dotenv').config()

const { BROWSER_WINDOW_WIDTH, BROWSER_WINDOW_HEIGHT } = process.env


const store = new Store();

const {
  txWs,
  stopLocalTerra,
  startLocalTerra,
  downloadLocalTerra,
  blockWs,
  subscribeToLocalTerraEvents,
  validateLocalTerraPath,
  parseTxDescriptionAndMsg,
  getSmartContractRefs,
  ContractStore,
} = require('./utils');

const contractStore = new ContractStore({ name: 'Imported Contracts' });

const {
  showPathSelectionDialog,
  showWrongDirectoryDialog,
  showLocalTerraAlreadyExistsDialog,
  showTxOccuredNotif,
  showSmartContractDialog
} = require('./messages');

async function init() {
  const win = new BrowserWindow({
    width: BROWSER_WINDOW_WIDTH ? Number(BROWSER_WINDOW_WIDTH) : 1200,
    height: BROWSER_WINDOW_HEIGHT ? Number(BROWSER_WINDOW_HEIGHT) : 720,
    minWidth: 690,
    minHeight: 460,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  let localTerraProcess;

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  }
  else {
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  txWs.subscribeTx({}, async ({ value }) => {
    const { description, msg } = parseTxDescriptionAndMsg(value.TxResult.tx);
    win.webContents.send('Tx', { description, msg, ...value });
    showTxOccuredNotif(description)
  });

  blockWs.subscribe('NewBlock', {}, ({ value }) => {
    win.webContents.send('NewBlock', value);
  });

  ipcMain.handle('SetLocalTerraPath', async () => {
    const { filePaths } = await showPathSelectionDialog();
    const isValid = validateLocalTerraPath(filePaths[0]);

    if (isValid) {
      await store.set('localTerraPath', filePaths[0]);
      localTerraProcess = startLocalTerra(filePaths[0]);
      await subscribeToLocalTerraEvents(localTerraProcess, win);
    }
    else {
      await showWrongDirectoryDialog();
      throw Error(`LocalTerra does not exist under the path '${localTerraPath}'`);
    }
  })

  ipcMain.handle('InstallLocalTerra', async () => {
    let localTerraPath;
    try {
      localTerraPath = await downloadLocalTerra();
      localTerraProcess = startLocalTerra(localTerraPath);
      await subscribeToLocalTerraEvents(localTerraProcess, win);
      await store.set('localTerraPath', localTerraPath);
    }
    catch (e) {
      await showLocalTerraAlreadyExistsDialog();
      throw Error("LocalTerra already exists under the default path")
    }
  });

  ipcMain.handle('ToggleLocalTerraStatus', async (_, localTerraStatus) => {
    const localTerraPath = await store.get('localTerraPath');

    if (localTerraStatus) {
      localTerraProcess = startLocalTerra(localTerraPath);
      await subscribeToLocalTerraEvents(localTerraProcess, win);
    }
    else {
      stopLocalTerra(localTerraProcess);
    }
    return localTerraStatus;
  });

  ipcMain.handle('AllContracts', async () => {
    contractStore.checkIfContractExists(contractStore.contracts);
    return contractStore.contracts;
  })

  ipcMain.handle('ImportContractRefs', async () => {
    const { filePaths } = await showSmartContractDialog();
    const [projectDir] = filePaths;
    const contractRefs = getSmartContractRefs(projectDir);
    await contractStore.addContract(contractRefs);
    return contractStore.contracts;
  })

  app.on('window-all-closed', async () => {
    await stopLocalTerra(localTerraProcess);
    app.quit();
  });

  const localTerraPath = await store.get('localTerraPath');
  if (localTerraPath) {
    win.webContents.send('LocalTerraPath', true);
    localTerraProcess = startLocalTerra(localTerraPath);
    await subscribeToLocalTerraEvents(localTerraProcess, win);
  }
  win.show();
}

app.on('ready', init);
