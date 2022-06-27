const Store = require('electron-store');

const { dialog, app, Notification } = require('electron');

const store = new Store();

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

 async function showNotifAccessDialog() {
  dialog.showMessageBox({ 
    message: 'Terrarium would like to send you notifications. Please grant access if you wish to receive them.', 
    title: 'Terrarium', 
    type: 'info' 
  });
  new Notification().show();
  await store.set('notifsGranted', true);
}

// NOTIFICATIONS

function showTxOccuredNotif(body) {
  console.log('showTxOccuredNotif', body)
  new Notification({
    title: 'Transaction Occurred',
    body
  }).show();
}


function showLocalTerraStopNotif() {
  new Notification({
    title: 'LocalTerra has stopped...',
  }).show();
}

function showLocalTerraStartNotif() {
  new Notification({ title: 'LocalTerra has started...' }).show();
}

function showGrantNotificationDia() {
  new Notification({ title: 'LocalTerra has started...' }).show();
}
module.exports = {
  showPathSelectionDialog,
  showGrantNotificationDia,
  showLocalTerraStartNotif,
  showNotifAccessDialog,
  showLocalTerraStopNotif,
  showTxOccuredNotif,
  showWrongDirectoryDialog,
  showLocalTerraAlreadyExistsDialog
};
