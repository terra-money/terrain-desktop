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

export const MICRO = 1000000;

export function microfy(num: number) {
  return num * MICRO as number;
}

export function demicrofy(num: number) {
  return num / MICRO as number;
}

export function truncate(
  text: string = '',
  [h, t]: [number, number] = [6, 6],
): string {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join('...') : text;
}
