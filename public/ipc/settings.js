const { app } = require('electron');
const toml = require('@iarna/toml');
const fs = require('fs');
const path = require('path');
const { ipcMain } = require('../utils/ipcMain');
const { store } = require('../utils/store');
const {
  DEFAULT_BLOCKTIME,
  ONESECOND_BLOCKTIME,
  TWOHUNDREDMS_BLOCKTIME,
  SET_LOCAL_TERRA_PATH,
  GET_BLOCKTIME,
  SET_BLOCKTIME,
  PROMPT_USER_RESTART,
  RESET_APP,
  CUSTOM_ERROR_DIALOG,
  GET_OPEN_AT_LOGIN,
  SET_OPEN_AT_LOGIN,
} = require('../constants');
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
  showCustomDialog,
  showPromptResetAppDialog,
} = require('../utils/messages');

const globals = require('../utils/globals');

// Register IPC handlers relating to the settings page.
module.exports = (win) => {
  ipcMain.secureHandle(
    GET_OPEN_AT_LOGIN,
    () => app.getLoginItemSettings().openAtLogin,
  );
  ipcMain.secureHandle(SET_OPEN_AT_LOGIN, (_, status) => app.setLoginItemSettings({ openAtLogin: status }));

  ipcMain.secureHandle(SET_LOCAL_TERRA_PATH, async (save = true) => {
    const { filePaths } = await showPathSelectionDialog();
    const isValid = validateLocalTerraPath(filePaths[0]);

    if (!filePaths.length) {
      await showWrongDirectoryDialog();
      throw Error(
        `No directory was selected does not exist under the path '${filePaths[0]}'`,
      );
    } else if (isValid && save) {
      store.setLocalTerraPath(filePaths[0]);
      // eslint-disable-next-line no-param-reassign
      globals.localTerraProcess = startLocalTerra(filePaths[0]);
      await subscribeToLocalTerraEvents(globals.localTerraProcess, win);
    } else if (!isValid && typeof globals.localTerraPath !== 'undefined') {
      await showWrongDirectoryDialog();
      throw Error(`LocalTerra does not exist under the path '${filePaths[0]}'`);
    }

    return filePaths[0];
  });

  ipcMain.secureHandle(RESET_APP, async () => {
    const { response } = await showPromptResetAppDialog();

    if (response === 1) {
      store.clear();
      shutdown(win, true);
    }
  });

  ipcMain.secureHandle(GET_BLOCKTIME, () => {
    const localTerraPath = store.getLocalTerraPath();
    const parsedConfig = toml.parse(
      fs.readFileSync(path.join(localTerraPath, 'config/config.toml')),
    );

    switch (parsedConfig.consensus.timeout_commit) {
      case '5s':
        return 'default';
      default:
        return parsedConfig.consensus.timeout_commit;
    }
  });

  ipcMain.secureHandle(CUSTOM_ERROR_DIALOG, async (_, err) => {
    await showCustomDialog(err.message || JSON.stringify(err));
  });

  ipcMain.secureHandle(SET_BLOCKTIME, (_, blocktime) => {
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

  ipcMain.secureHandle(PROMPT_USER_RESTART, async () => {
    const { response } = await showPromptUserRestartDialog();

    if (response === 1) {
      shutdown(win, true);
    }
  });
};
