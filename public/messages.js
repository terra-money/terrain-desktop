const { dialog, app, Notification } = require('electron');

// DIALOGS

async function showPathSelectionDialog() {
  return dialog.showOpenDialog({
    message: 'Select your LocalTerra directory.',
    title: 'Terrarium',
    type: 'info',
    properties: ['openDirectory']
  });
}

async function showWrongDirectoryDialog() {
  return dialog.showMessageBox({
    message: 'Please select a valid LocalTerra directory',
    title: 'Terrarium',
    type: 'warning'
  });
}

async function showLocalTerraAlreadyExistsDialog() {
  return dialog.showMessageBox({
    message: `LocalTerra already exists in the default installation folder '${app.getPath('appData')}/LocalTerra'. Delete the exsisting LocalTerra directory to continue with the installation or select it to start Terrarium.`,
    title: 'Terrarium',
    type: 'warning'
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
  showLocalTerraAlreadyExistsDialog
};
