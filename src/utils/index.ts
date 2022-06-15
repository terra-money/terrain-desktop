import { Tx } from '@terra-money/terra.js';
import { readMsg } from '@terra-money/msg-reader';

export function decodeTx(encodedTx: any) {
  return Tx.unpackAny({
    value: Buffer.from(encodedTx, 'base64'),
    typeUrl: '',
  });
}

export const parseTxMessage = (tx: any) => {
  const unpacked = decodeTx(tx);
  return unpacked.body.messages[0] as any;
};

export function parseTxDescription(value: any) {
  const txEncodedMsgDescription = parseTxMessage(value);
  return readMsg(txEncodedMsgDescription);
}
