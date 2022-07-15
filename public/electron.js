const path = require('path');
const {
  app, shell, ipcMain, BrowserWindow, Menu, Tray, MenuItem,
} = require('electron');
const isDev = require('electron-is-dev');
const defaultMenu = require('electron-default-menu');
const { store } = require('./store');
const pkg = require('../package.json');

const { BROWSER_WINDOW_WIDTH, BROWSER_WINDOW_HEIGHT } = require('./constants');

const {
  txWs,
  blockWs,
  stopLocalTerra,
  startLocalTerra,
  downloadLocalTerra,
  subscribeToLocalTerraEvents,
  validateLocalTerraPath,
  parseTxDescriptionAndMsg,
  getSmartContractRefs,
  setDockIconDisplay,
  isDockerRunning,
  shutdown,
} = require('./utils');

const {
  showPathSelectionDialog,
  showWrongDirectoryDialog,
  showLocalTerraAlreadyExistsDialog,
  showTxOccuredNotif,
  showSmartContractDialog,
  showStartDockerDialog,
} = require('./messages');

let tray = null;

app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: pkg.version,
});

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
    },
  });

  let localTerraProcess;
  tray = new Tray(path.join(__dirname, 'tray.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        setDockIconDisplay(true, win);
        win.show();
      },
    },
    { type: 'separator' },
    { label: 'About', role: 'about' },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => shutdown(localTerraProcess, win),
    },
  ]);

  tray.setContextMenu(contextMenu);

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  }

  /**
   * On macOS we need to patch the default Electron menu to run
   * our custom shutdown instead of just closing or hiding the window.
   * On Windows and Linux closing the app isn't an option from the app menu.
   * */
  if (process.platform === 'darwin') {
    const appMenu = defaultMenu(app, shell);
    appMenu[0].submenu[8] = new MenuItem({
      label: `Quit ${app.getName()}`,
      accelerator: 'Command+Q',
      click: () => shutdown(localTerraProcess, win),
    });
    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu));
  }

  if (!(await isDockerRunning())) {
    await showStartDockerDialog();
    app.quit();
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  txWs.subscribeTx({}, async ({ value }) => {
    const { description, msg } = parseTxDescriptionAndMsg(value.TxResult.tx);
    win.webContents.send('Tx', { description, msg, ...value });
    showTxOccuredNotif(description);
  });

  blockWs.subscribe('NewBlock', {}, ({ value }) => {
    win.webContents.send('NewBlock', value);
  });

  ipcMain.handle('SetLocalTerraPath', async () => {
    const { filePaths } = await showPathSelectionDialog();
    const isValid = validateLocalTerraPath(filePaths[0]);

    if (isValid) {
      await store.setLocalTerraPath(filePaths[0]);
      localTerraProcess = startLocalTerra(filePaths[0]);
      await subscribeToLocalTerraEvents(localTerraProcess, win);
    } else {
      await showWrongDirectoryDialog();
      throw Error(`LocalTerra does not exist under the path '${localTerraPath}'`);
    }
  });

  ipcMain.handle('InstallLocalTerra', async () => {
    let localTerraPath;
    try {
      localTerraPath = await downloadLocalTerra();
      localTerraProcess = startLocalTerra(localTerraPath);
      await subscribeToLocalTerraEvents(localTerraProcess, win);
      await store.setLocalTerraPath(localTerraPath);
    } catch (e) {
      await showLocalTerraAlreadyExistsDialog();
      throw Error('LocalTerra already exists under the default path');
    }
  });

  ipcMain.handle('ToggleLocalTerraStatus', async (_, localTerraStatus) => {
    const localTerraPath = await store.getLocalTerraPath();

    if (localTerraStatus) {
      localTerraProcess = startLocalTerra(localTerraPath);
      await subscribeToLocalTerraEvents(localTerraProcess, win);
    } else {
      stopLocalTerra(localTerraProcess);
    }
    return localTerraStatus;
  });

  ipcMain.handle('ImportContracts', () => store.getContracts());

  ipcMain.handle('ImportContractRefs', async () => {
    const { filePaths } = await showSmartContractDialog();

    if (!filePaths.length) {
      return store.getContracts();
    }
    const [projectDir] = filePaths;
    const contractRefs = getSmartContractRefs(projectDir);
    const contracts = await store.importContracts(contractRefs);
    return contracts;
  });

  // Catch window close and hide the window instead.
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
      setDockIconDisplay(false, win);
    }
    return false;
  });

  ipcMain.handle('DeleteAllContractRefs', () => store.deleteAllContracts());

  app.on('window-all-closed', async () => {
    await stopLocalTerra(localTerraProcess);
    app.quit();
  });

  process.on('SIGINT', async () => { // catch ctrl+c event
    await stopLocalTerra(localTerraProcess);
    app.quit();
  });

  const localTerraPath = await store.getLocalTerraPath();
  if (localTerraPath) {
    win.webContents.send('LocalTerraPath', true);
    localTerraProcess = startLocalTerra(localTerraPath);
    await subscribeToLocalTerraEvents(localTerraProcess, win);
  }

  win.show();
  win.focus();
}

app.on('ready', init);
