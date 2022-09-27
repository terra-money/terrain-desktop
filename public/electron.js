const path = require('path');
const {
  app, shell, BrowserWindow, Menu, Tray, MenuItem, session,
} = require('electron');
const isDev = require('electron-is-dev');
const defaultMenu = require('electron-default-menu');
const { store } = require('./utils/store');
const pkg = require('../package.json');
const registerSettingsHandlers = require('./ipc/settings');
const registerContractHandlers = require('./ipc/contracts');
const regsisterLocalTerraHandlers = require('./ipc/localTerra');
const {
  BROWSER_WINDOW_WIDTH,
  BROWSER_WINDOW_HEIGHT,
  LOCAL_TERRA_PATH_CONFIGURED,
} = require('../src/constants');
const {
  stopLocalTerra,
  startLocalTerra,
  subscribeToLocalTerraEvents,
  isDockerRunning,
  shutdown,
} = require('./utils/localTerra');
const globals = require('./utils/globals');
const { setDockIconDisplay } = require('./utils/misc');
const { showStartDockerDialog } = require('./utils/messages');

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

  tray = new Tray(path.join(__dirname, 'trayTemplate@3x.png'));
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
      click: () => { tray = null; shutdown(win) },
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
      click: () => { tray = null; shutdown(win) },
    });
    
    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu));
  }

  const isRunning = await isDockerRunning();
  if (!isRunning) {
    await showStartDockerDialog();
    app.quit();
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  registerSettingsHandlers(win);
  regsisterLocalTerraHandlers(win);
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
    await stopLocalTerra();
    app.quit();
  });

  process.on('SIGINT', async () => { // catch ctrl+c event
    await stopLocalTerra();
    app.quit();
  });

  win.webContents.once('dom-ready', async () => {
    const localTerraPath = await store.getLocalTerraPath();
    if (localTerraPath) {
      win.webContents.send(LOCAL_TERRA_PATH_CONFIGURED, true);
      await startLocalTerra(localTerraPath);
      globals.localTerra.process = await subscribeToLocalTerraEvents(win);
    }
    win.show();
    win.focus();
  });
}

app.on('ready', init);
