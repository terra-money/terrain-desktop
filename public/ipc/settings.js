const { app, ipcMain } = require('electron');
const toml = require('@iarna/toml');
const fs = require('fs');
const path = require('path');
const { store } = require('../store');
const {
  DEFAULT_BLOCKTIME, ONESECOND_BLOCKTIME, TWOHUNDREDMS_BLOCKTIME,
  SET_LOCAL_TERRA_PATH, GET_BLOCKTIME, SET_BLOCKTIME, PROMT_USER_RESTART,
} = require('../../src/constants');
const {
  startLocalTerra,
  subscribeToLocalTerraEvents,
  validateLocalTerraPath,
  shutdown,
} = require('../utils/localTerra');

const {
  showPathSelectionDialog,
  showWrongDirectoryDialog,
  showPromptUserRestartDialog,
} = require('../utils/messages');

// Register IPC handlers relating to the settings page.
module.exports = (win, globals) => {
  ipcMain.handle(SET_LOCAL_TERRA_PATH, async (save = true) => {
    const { filePaths } = await showPathSelectionDialog();
    const isValid = validateLocalTerraPath(filePaths[0]);

    if (isValid && save) {
      store.setLocalTerraPath(filePaths[0]);
      // eslint-disable-next-line no-param-reassign
      globals.localTerraProcess = startLocalTerra(filePaths[0]);
      await subscribeToLocalTerraEvents(globals.localTerraProcess, win);
    } else {
      await showWrongDirectoryDialog();
      throw Error(`LocalTerra does not exist under the path '${globals.localTerraPath}'`);
    }

    return filePaths[0];
  });

  ipcMain.handle(GET_BLOCKTIME, () => {
    const localTerraPath = store.getLocalTerraPath();
    const parsedConfig = toml.parse(fs.readFileSync(path.join(localTerraPath, 'config/config.toml')));
    switch (parsedConfig.consensus.timeout_commit) {
      case '5s':
        return 'default';
      default:
        return parsedConfig.consensus.timeout_commit;
    }
  });

  ipcMain.handle(SET_BLOCKTIME, (_, blocktime) => {
    const localTerraPath = store.getLocalTerraPath();
    const configPath = path.join(localTerraPath, 'config/config.toml');
    const parsedConfig = toml.parse(fs.readFileSync(configPath, 'utf8'));

    let newBlocktime = DEFAULT_BLOCKTIME;
    if (blocktime === '1s') {
      newBlocktime = ONESECOND_BLOCKTIME;
    } else if (blocktime === '200ms') {
      newBlocktime = TWOHUNDREDMS_BLOCKTIME;
    }

    parsedConfig.consensus = {
      ...parsedConfig.consensus,
      ...newBlocktime,
    };

    fs.writeFileSync(configPath, toml.stringify(parsedConfig));
  });

  ipcMain.handle(PROMT_USER_RESTART, () => {
    const { response } = showPromptUserRestartDialog();

    if (response === 1) {
      shutdown(globals.localTerraProcess, win, true);
    }
    ipcMain.handle('getOpenAtLogin', () => app.getLoginItemSettings().openAtLogin);
    ipcMain.handle('setOpenAtLogin', (_, status) => app.setLoginItemSettings({ openAtLogin: status }));
  });
};
