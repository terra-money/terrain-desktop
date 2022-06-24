const { dialog, app } = require('electron');

async function displayPathSelectionWindow() {
  return dialog.showOpenDialog({
    message: 'Select your LocalTerra directory.',
    title: 'Terrarium',
    type: 'info',
    properties: ['openDirectory']
  });
}

async function displayWrongDirectoryDialog() {
  return dialog.showMessageBox({
    message: 'Please select a valid LocalTerra directory',
    title: 'Terrarium',
    type: 'warning'
  });
}

async function displayLocalTerraAlreadyExistsDialog() {
  return dialog.showMessageBox({
    message: `LocalTerra already exists in the default installation folder '${app.getPath('appData')}/LocalTerra'. Delete the LocalTerra folder to continue with the installation or chose a different LocalTerra folder.`,
    title: 'Terrarium',
    type: 'warning'
  });
}

module.exports = {
  displayPathSelectionWindow,
  displayWrongDirectoryDialog,
  displayLocalTerraAlreadyExistsDialog
};
