const { dialog, app } = require('electron');

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

module.exports = {
  showPathSelectionDialog,
  ShowWrongDirectoryDialog,
  showLocalTerraAlreadyExistsDialog
};
