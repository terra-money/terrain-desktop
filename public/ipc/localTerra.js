const { ipcMain } = require('electron');
const {
  stopLocalTerra,
  startLocalTerra,
  downloadLocalTerra,
  subscribeToLocalTerraEvents,
} = require('../utils/localTerra');
const { store } = require('../store');
const { showLocalTerraAlreadyExistsDialog } = require('../utils/messages');
const { INSTALL_LOCAL_TERRA, TOGGLE_LOCAL_TERRA, GET_LOCAL_TERRA_STATUS } = require('../../src/constants');

// Register IPC handlers relating to localTerra and contracts importing.
module.exports = (win, globals) => {
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

  ipcMain.on(GET_LOCAL_TERRA_STATUS, () => win.webContents.send('LocalTerraRunning', globals.isLocalTerraRunning));

  ipcMain.handle(TOGGLE_LOCAL_TERRA, async (_, localTerraStatus) => {
    console.log('toggle called with: ', localTerraStatus);
    const localTerraPath = store.getLocalTerraPath();

    if (localTerraStatus) {
      startLocalTerra(localTerraPath);
      globals.localTerraProcess = await subscribeToLocalTerraEvents(win);
    } else {
      stopLocalTerra(globals.localTerraProcess);
    }
    return localTerraStatus;
  });
};
