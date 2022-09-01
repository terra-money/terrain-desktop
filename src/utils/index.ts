import { bech32 } from 'bech32';
import { REACT_APP_FINDER_URL, REACT_APP_DOCS_URL } from '../constants';

function isValidTerraAddress(address: string) {
  try {
    const { prefix: decodedPrefix } = bech32.decode(address);
    return decodedPrefix === 'terra';
  } catch {
    return false;
  }
}

export const parseSearchUrl = (searchQuery: string) => {
  if (Number(searchQuery)) {
    return `${REACT_APP_FINDER_URL}/blocks/${searchQuery}`;
  } if (isValidTerraAddress(searchQuery)) {
    return `${REACT_APP_FINDER_URL}/address/${searchQuery}`;
  } if (searchQuery.length === 64) {
    return `${REACT_APP_FINDER_URL}/tx/${searchQuery}`;
  }
  return `${REACT_APP_DOCS_URL}?q=${searchQuery}`;
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

export function nFormatter(num: number) {
  const digits = 4;
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find((x: any) => num >= x.value);
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

export const tourProviderProps = {
  steps: [
    {
      selector: '.search',
      content: 'This is the search bar',
    },
    {
      selector: '.Contracts',
      content: 'This is the contracts page',
    },
    {
      selector: '.Accounts',
      content: 'This is the accounts page',
    },
    {
      selector: '.Blocks',
      content: 'This is the blocks page',
    },
    {
      selector: '.Transactions',
      content: 'This is the transaction page',
    },
    {
      selector: '.Logs',
      content: 'This is the logs page bar',
    },
    {
      selector: '.Settings',
      content: 'This is the settings modal',
    },
    {
      selector: '.current-block',
      content: 'This is the current-block bar',
    },
    {
      selector: '.toggle-terra',
      content: 'This is the toggle terra button',
    },
    {
      selector: '.add-contracts',
      content: 'This is the add contracts btn',
    },
    {
      selector: '.contract-view',
      content: 'This is the contract view of pre-baked contract',
    },
  ],
};
