const LOCALTERRA_PATH_DIALOG = { message: 'Select your LocalTerra directory.', type: 'info', properties: ['openDirectory'] };
const LOCALTERRA_STOP_DIALOG = { message: 'LocalTerra stopped. Restarting...', title: 'Terrarium', type: 'warning' };
const LOCALTERRA_BAD_DIR_DIALOG = { message: 'Please select a valid LocalTerra directory', title: 'Terrarium', type: 'warning' };
const LOCAL_WS = 'ws://localhost:26657/websocket';

module.exports = {
  LOCAL_WS,
  LOCALTERRA_BAD_DIR_DIALOG,
  LOCALTERRA_STOP_DIALOG,
  LOCALTERRA_PATH_DIALOG,
};
