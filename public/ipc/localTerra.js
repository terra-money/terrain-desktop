const { ipcMain } = require('electron');
const {
  stopLocalTerra,
  startLocalTerra,
  downloadLocalTerra,
  subscribeToLocalTerraEvents,
} = require('../utils/localTerra');
const { store } = require('../utils/store');
const { showLocalTerraAlreadyExistsDialog, showCustomDialog } = require('../utils/messages');
const {
  INSTALL_LOCAL_TERRA, TOGGLE_LOCAL_TERRA, GET_LOCAL_TERRA_STATUS, LOCAL_TERRA_IS_RUNNING,
} = require('../../src/constants');
const globals = require('../utils/globals');

// Register IPC handlers relating to localTerra and contracts importing.
module.exports = (win) => {
  ipcMain.handle(INSTALL_LOCAL_TERRA, async () => {
    let localTerraPath;
    try {
      localTerraPath = await downloadLocalTerra();
      globals.localTerra.process = await subscribeToLocalTerraEvents(win);
      store.setLocalTerraPath(localTerraPath);
    } catch (err) {
      if (err.message.includes('LocalTerra already exists')) {
        await showLocalTerraAlreadyExistsDialog();
      } else {
        await showCustomDialog(JSON.stringify(err));
      }
    }
  });

  ipcMain.on(GET_LOCAL_TERRA_STATUS, () => {
    win.webContents.send(LOCAL_TERRA_IS_RUNNING, globals.localTerra.isRunning);
  });

  ipcMain.handle(TOGGLE_LOCAL_TERRA, async (_, localTerraStatus) => {
    const localTerraPath = store.getLocalTerraPath();

    if (localTerraStatus) {
      await startLocalTerra(localTerraPath);
      globals.localTerra.process = await subscribeToLocalTerraEvents(win);
    } else {
      stopLocalTerra();
    }
    return localTerraStatus;
  });
};
