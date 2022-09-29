const { Tx } = require('@terra-money/terra.js');
const { readMsg } = require('@terra-money/msg-reader');
const { app } = require('electron');
const isDev = require('electron-is-dev');
const { FINDER_ORIGIN, DOCS_ORIGIN } = require('../../src/constants');

const parseTxMsg = (encodedTx) => {
  const unpacked = Tx.unpackAny({
    value: Buffer.from(encodedTx, 'base64'),
    typeUrl: '',
  });
  return unpacked.body.messages[0];
};

const isValidOrigin = (origin) => {
  const ALLOWED_ORIGINS = [FINDER_ORIGIN, DOCS_ORIGIN];
  const parsedOrigin = new URL(origin);
  return parsedOrigin.protocol === 'https:' && ALLOWED_ORIGINS.includes(parsedOrigin.origin);
};

const parseTxDescriptionAndMsg = (tx) => {
  const msg = parseTxMsg(tx);
  const description = readMsg(msg);
  return { msg: msg.toData(), description };
};

const setDockIconDisplay = (state, win) => {
  if (process.platform === 'darwin') {
    app.dock[state ? 'show' : 'hide']();
  } else {
    win.setSkipTaskbar(!!state);
  }
};

const validateIpcSender = (senderFrame) => isDev || new URL(senderFrame.url).protocol === 'file:';

export default validateIpcSender;

module.exports = {
  parseTxDescriptionAndMsg,
  parseTxMsg,
  setDockIconDisplay,
  isValidOrigin,
  validateIpcSender,
};
