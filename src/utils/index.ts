import { bech32 } from 'bech32';

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

