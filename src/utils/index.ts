import { Tx, TxResult } from '@terra-money/terra.js';

export const parseMessageFromTx = (tx: TxResult) => {
  const unpacked = Tx.unpackAny(({ value: Buffer.from(tx.tx as any, 'base64') }) as any);
  return unpacked.body.messages[0] as any;
};

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
