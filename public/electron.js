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
  startMemMonitor,
} = require('./utils/localTerra');
const globals = require('./utils/globals');
const { setDockIconDisplay, isValidOrigin } = require('./utils/misc');
const { showStartDockerDialog } = require('./utils/messages');

let tray = null;
const APP_URL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: pkg.version,
});

async function init() {
  const win = new BrowserWindow({
    width: Number(BROWSER_WINDOW_WIDTH),
    height: Number(BROWSER_WINDOW_HEIGHT),
    minWidth: Number(BROWSER_WINDOW_WIDTH),
    minHeight: Number(BROWSER_WINDOW_HEIGHT),
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  tray = new Tray(path.join(__dirname, '../src', 'assets', 'trayTemplate@3x.png'));
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
      click: () => { tray = null; shutdown(win); },
    },
  ]);

  tray.setContextMenu(contextMenu);
  win.loadURL(APP_URL);

  if (isDev) {
    await session.defaultSession.loadExtension(path.resolve('extensions', 'redux'));
    win.webContents.openDevTools();
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
      click: () => { tray = null; shutdown(win); },
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu));
  }

  if (!await isDockerRunning()) {
    await showStartDockerDialog();
    app.quit();
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isValidOrigin(url)) {
      const child = new BrowserWindow({
        width: 1000, height: 600, parent: win, show: false,
      });
      child.loadURL(url);
      child.once('ready-to-show', () => { child.show(); });
    }
    return { action: 'deny' };
  });

  registerSettingsHandlers(win);
  regsisterLocalTerraHandlers(win);
  registerContractHandlers();
  startMemMonitor();

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

  process.on('SIGINT', async () => {
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
