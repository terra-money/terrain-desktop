const Store = require('electron-store');

const { dialog, app, Notification } = require('electron');
const { parseTxDescription } = require('../src/utils');

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

async function ShowWrongDirectoryDialog() {
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
  await store.set('notificationsGranted', true);
}

// NOTIFICATIONS

function showTxOccuredNotif(tx) {
  const txMsg = parseTxDescription(tx);
  return new Notification({
    title: 'Transaction Occurred',
    body: txMsg.toString()
  }).show();
}


function showLocalTerraStopNotif() {
  return new Notification({
    title: 'LocalTerra has stopped...',
  }).show();
}

function showLocalTerraStartNotif() {
  return new Notification({
    title: 'LocalTerra has started...',
  }).show();
}

function showGrantNotificationDia() {
  return new Notification({
    title: 'LocalTerra has started...',
  }).show();
}
module.exports = {
  showPathSelectionDialog,
  showGrantNotificationDia,
  showLocalTerraStartNotif,
  showNotifAccessDialog,
  showLocalTerraStopNotif,
  showTxOccuredNotif,
  ShowWrongDirectoryDialog,
  showLocalTerraAlreadyExistsDialog
};
