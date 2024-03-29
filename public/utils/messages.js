const { dialog, app, Notification } = require('electron');

// DIALOGS
const showPromptUserRestartDialog = async () => dialog.showMessageBox({
  message: 'Settings which you have changed require a restart to update.  Restart the application?',
  buttons: ['No', 'Yes'],
  title: 'Terrarium',
  type: 'question',
});

const showPromptResetAppDialog = async () => dialog.showMessageBox({
  message: 'This will restore app to factory settings.  Reset the application?',
  buttons: ['No', 'Yes'],
  title: 'Terrarium',
  type: 'question',
});

const showPathSelectionDialog = async () => dialog.showOpenDialog({
  message: 'Select your LocalTerra directory.',
  title: 'Terrarium',
  type: 'info',
  defaultPath: app.getPath('appData'),
  properties: ['openDirectory'],
});

const showSmartContractDialog = async () => dialog.showOpenDialog({
  message: 'Select your project directory. It must contain a refs.terrain.json file.',
  title: 'Terrarium',
  type: 'info',
  properties: ['openDirectory'],
});

const showCustomDialog = async (message) => dialog.showMessageBox({
  message,
  title: 'Terrarium',
  type: 'warning',
});

const showStartDockerDialog = async () => dialog.showMessageBox({
  message: 'Start Docker then re-open Terrarium. Terrarium needs it to run LocalTerra.',
  title: 'Terrarium',
  type: 'warning',
});

const showMemoryOveruseDialog = async () => dialog.showMessageBox({
  message: 'You\'re running out of memory. If this is a consistent problem try running Terrarium in LiteMode.',
  title: 'Terrarium',
  type: 'warning',
});

const showMissingSchemaDialog = async () => dialog.showMessageBox({
  message: 'Some schemas were missing from your terrain project directory. Run `cargo schema` in your contract folder and re-import access contract methods.',
  title: 'Terrarium',
  type: 'warning',
});

const showWrongDirectoryDialog = async () => dialog.showMessageBox({
  message: 'Please select a valid LocalTerra directory',
  title: 'Terrarium',
  type: 'warning',
});

const showLocalTerraAlreadyExistsDialog = async () => dialog.showMessageBox({
  message: `LocalTerra already exists in the default installation folder '${app.getPath('appData')}/LocalTerra'. 
    Delete the existing LocalTerra directory to continue with the installation or select it to start Terrarium.`,
  title: 'Terrarium',
  type: 'warning',
});

const showNoTerrainRefsDialog = async () => dialog.showMessageBox({
  message: 'Unable to read contract refs. Make sure refs.terrain.json exists and is not empty before trying again.',
  title: 'Terrarium',
  type: 'error',
});

// NOTIFICATIONS
const showTxOccuredNotif = (body) => {
  new Notification({ title: 'Transaction Occurred', body }).show();
};

const showLocalTerraStopNotif = () => {
  new Notification({ title: 'Stopping LocalTerra...', silent: true }).show();
};

const showLocalTerraStartNotif = () => {
  new Notification({ title: 'Starting LocalTerra...', silent: true }).show();
};

module.exports = {
  showPromptUserRestartDialog,
  showPathSelectionDialog,
  showLocalTerraStartNotif,
  showLocalTerraStopNotif,
  showTxOccuredNotif,
  showWrongDirectoryDialog,
  showSmartContractDialog,
  showLocalTerraAlreadyExistsDialog,
  showNoTerrainRefsDialog,
  showStartDockerDialog,
  showMissingSchemaDialog,
  showCustomDialog,
  showPromptResetAppDialog,
  showMemoryOveruseDialog,
};
