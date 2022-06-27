import { Tx } from '@terra-money/terra.js';
import { bech32 } from 'bech32';

export function decodeTx(encodedTx: any) {
  return Tx.unpackAny({
    value: Buffer.from(encodedTx, 'base64'),
    typeUrl: '',
  });
}

function isValidTerraAddress(address: string) {
  try {
    const { prefix: decodedPrefix } = bech32.decode(address); // throw error if checksum is invalid
    return decodedPrefix === 'terra';
  } catch {
    return false;
  }
}
export const parseSearchUrl = (searchQuery: string) => {
  if (Number(searchQuery)) {
    return `${process.env.REACT_APP_FINDER_URL}/blocks/${searchQuery}`;
  } if (isValidTerraAddress(searchQuery)) {
    return `${process.env.REACT_APP_FINDER_URL}/address/${searchQuery}`;
  } if (searchQuery.length === 64) {
    return `${process.env.REACT_APP_FINDER_URL}/tx/${searchQuery}`;
  }
  return `${process.env.REACT_APP_DOCS_URL}?q=${searchQuery}`;
};

export const MICRO = 1000000;
export const microfy = (num: number) => num * MICRO as number;
export const demicrofy = (num: number) => num / MICRO as number;

export function truncate(
  text: string = '',
  [h, t]: [number, number] = [6, 6],
): string {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join('...') : text;
}
