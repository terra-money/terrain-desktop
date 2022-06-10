import { Tx, TxResult } from '@terra-money/terra.js';

export const parseMessageFromTx = (tx: TxResult) => {
  const unpacked = Tx.unpackAny(({ value: Buffer.from(tx.tx as any, 'base64') }) as any);
  return unpacked.body.messages[0] as any;
};
