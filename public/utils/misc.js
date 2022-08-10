const { Tx } = require('@terra-money/terra.js');
const { readMsg } = require('@terra-money/msg-reader');
const { app } = require('electron');

const parseTxMsg = (encodedTx) => {
  const unpacked = Tx.unpackAny({
    value: Buffer.from(encodedTx, 'base64'),
    typeUrl: '',
  });
  return unpacked.body.messages[0];
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

module.exports = {
  parseTxDescriptionAndMsg,
  parseTxMsg,
  setDockIconDisplay,
};
