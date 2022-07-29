const { ipcMain } = require('electron');
const {
  stopLocalTerra,
  startLocalTerra,
  downloadLocalTerra,
  subscribeToLocalTerraEvents,
} = require('../utils/localTerra');
const { store } = require('../store');
const { showLocalTerraAlreadyExistsDialog } = require('../utils/messages');
const {
  INSTALL_LOCAL_TERRA, TOGGLE_LOCAL_TERRA, GET_LOCAL_TERRA_STATUS, LOCAL_TERRA_IS_RUNNING,
} = require('../../src/constants');

// Register IPC handlers relating to localTerra and contracts importing.
module.exports = (win, globals) => {
  console.log('globals in ipc/localTerra', globals);
  ipcMain.handle(INSTALL_LOCAL_TERRA, async () => {
    let localTerraPath;
    try {
      localTerraPath = await downloadLocalTerra();
      startLocalTerra(localTerraPath);
      globals.localTerraProcess = await subscribeToLocalTerraEvents(win);
      store.setLocalTerraPath(localTerraPath);
    } catch (e) {
      await showLocalTerraAlreadyExistsDialog();
      throw Error('LocalTerra already exists under the default path');
    }
  });

  ipcMain.on(GET_LOCAL_TERRA_STATUS, () => {
    console.log('localTerraisRunning event in electron', globals.localTerraisRunning);
    win.webContents.send(LOCAL_TERRA_IS_RUNNING, globals.isLocalTerraRunning);
  });

  ipcMain.handle(TOGGLE_LOCAL_TERRA, async (_, localTerraStatus) => {
    const localTerraPath = store.getLocalTerraPath();
    console.log('localTerraPath in TOGGLE_LOCAL_TERRA', localTerraPath);
    console.log('localTerraStatus in TOGGLE_LOCAL_TERRA', localTerraStatus);

    if (localTerraStatus) {
      startLocalTerra(localTerraPath);
      globals.localTerraProcess = await subscribeToLocalTerraEvents(win);
    } else {
      stopLocalTerra(globals.localTerraProcess);
    }
    return localTerraStatus;
  });
};
