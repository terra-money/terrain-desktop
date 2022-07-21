const { dialog, app, Notification } = require('electron');

// DIALOGS

async function showPathSelectionDialog() {
  return dialog.showOpenDialog({
    message: 'Select your LocalTerra directory.',
    title: 'Terrarium',
    type: 'info',
    properties: ['openDirectory'],
  });
}

async function showSmartContractDialog() {
  return dialog.showOpenDialog({
    message: 'Select your project directory. It must contain a refs.terrain.json file.',
    title: 'Terrarium',
    type: 'info',
    properties: ['openDirectory'],
  });
}

async function showStartDockerDialog() {
  return dialog.showMessageBox({
    message: 'Start Docker then try opening Terrarium again.',
    title: 'Terrarium',
    type: 'warning',
  });
}

async function showWrongDirectoryDialog() {
  return dialog.showMessageBox({
    message: 'Please select a valid LocalTerra directory',
    title: 'Terrarium',
    type: 'warning',
  });
}

async function showLocalTerraAlreadyExistsDialog() {
  return dialog.showMessageBox({
    message: `LocalTerra already exists in the default installation folder '${app.getPath('appData')}/LocalTerra'. Delete the exsisting LocalTerra directory to continue with the installation or select it to start Terrarium.`,
    title: 'Terrarium',
    type: 'warning',
  });
}

async function showNoTerrainRefsDialog() {
  return dialog.showMessageBox({
    message: 'Unable to read contract refs. Make sure refs.terrain.json exists and is not empty before trying again.',
    title: 'Terrarium',
    type: 'error',
  });
}

// NOTIFICATIONS

function showTxOccuredNotif(body) {
  new Notification({ title: 'Transaction Occurred', body }).show();
}

function showLocalTerraStopNotif() {
  new Notification({ title: 'Stopping LocalTerra...', silent: true }).show();
}

function showLocalTerraStartNotif() {
  new Notification({ title: 'Starting LocalTerra...', silent: true }).show();
}

module.exports = {
  showPathSelectionDialog,
  showLocalTerraStartNotif,
  showLocalTerraStopNotif,
  showTxOccuredNotif,
  showWrongDirectoryDialog,
  showSmartContractDialog,
  showLocalTerraAlreadyExistsDialog,
  showNoTerrainRefsDialog,
  showStartDockerDialog,
};
