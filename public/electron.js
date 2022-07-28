const path = require('path');
const {
  app, shell, BrowserWindow, Menu, Tray, MenuItem, session,
} = require('electron');
const isDev = require('electron-is-dev');
const defaultMenu = require('electron-default-menu');
const { store } = require('./store');
const pkg = require('../package.json');
const registerSettingsHandlers = require('./ipc/settings');
const registerContractHandlers = require('./ipc/contracts');
const regsisterLocalTerraHandlers = require('./ipc/localTerra');

const {
  BROWSER_WINDOW_WIDTH,
  BROWSER_WINDOW_HEIGHT,
} = require('../src/constants');

const {
  txWs,
  blockWs,
  stopLocalTerra,
  startLocalTerra,
  subscribeToLocalTerraEvents,
  parseTxDescriptionAndMsg,
  setDockIconDisplay,
  isDockerRunning,
  shutdown,
} = require('./utils/localTerra');

const { showTxOccuredNotif, showStartDockerDialog } = require('./utils/messages');

// Store in an object so values are passed by reference.
const globals = {
  localTerraProcess: undefined,
  localTerraisRunning: undefined,
};

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
      click: () => shutdown(globals.localTerraProcess, win),
    },
  ]);

  tray.setContextMenu(contextMenu);

  if (isDev) {
    win.loadURL('http://localhost:3000');
    await session.defaultSession.loadExtension(path.resolve('extensions', 'redux'));
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
      click: () => shutdown(globals.localTerraProcess, win),
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

  registerSettingsHandlers(win, globals);
  regsisterLocalTerraHandlers(win, globals);
  registerContractHandlers();

  // Catch window close and hide the window instead.
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
      setDockIconDisplay(false, win);
    }
    return false;
  });

  app.on('window-all-closed', async () => {
    await stopLocalTerra(globals.localTerraProcess);
    app.quit();
  });

  process.on('SIGINT', async () => { // catch ctrl+c event
    await stopLocalTerra(globals.localTerraProcess);
    app.quit();
  });

  win.webContents.once('dom-ready', async () => {
    const localTerraPath = await store.getLocalTerraPath();
    if (localTerraPath) {
      win.webContents.send('LocalTerraPath', true);
      startLocalTerra(localTerraPath);
      globals.localTerraProcess = await subscribeToLocalTerraEvents(win);
    }

    txWs.subscribeTx({}, async ({ value }) => {
      const { description, msg } = parseTxDescriptionAndMsg(value.TxResult.tx);
      win.webContents.send('Tx', { description, msg, ...value });
      showTxOccuredNotif(description);
    });

    blockWs.subscribe('NewBlock', {}, ({ value }) => {
      win.webContents.send('NewBlock', value);
    });

    win.show();
    win.focus();
  });
}

app.on('ready', init);
