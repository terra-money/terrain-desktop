const LOCALTERRA_PATH_DIALOG = { message: 'Select your LocalTerra directory.', type: 'info', properties: ['openDirectory'] };
const LOCALTERRA_STOP_DIALOG = { message: 'LocalTerra stopped. Restarting...', title: 'Terrarium', type: 'warning' };
const LOCALTERRA_BAD_DIR_DIALOG = { message: 'Please select a valid LocalTerra directory', title: 'Terrarium', type: 'warning' };
const LOCAL_WS = 'ws://localhost:26657/websocket';
const NOTIFICATION_ACCESS = { message: 'Terrarium would like to send you notifications. Please grant access if you wish to receive them.', title: 'Terrarium', type: 'info' }
const NOTIFICATION_TITLE = { message: 'Transaction Occurred' }

module.exports = {
  LOCAL_WS,
  LOCALTERRA_BAD_DIR_DIALOG,
  LOCALTERRA_STOP_DIALOG,
  LOCALTERRA_PATH_DIALOG,
  NOTIFICATION_ACCESS,
  NOTIFICATION_TITLE
};
