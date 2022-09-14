import { bech32 } from 'bech32';
import { useState, useEffect } from 'react';
import { REACT_APP_FINDER_URL, REACT_APP_DOCS_URL } from '../constants';

function isValidTerraAddress(address: string) {
  try {
    const { prefix: decodedPrefix } = bech32.decode(address);
    return decodedPrefix === 'terra';
  } catch {
    return false;
  }
}

const getWindowDimensions = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    width,
    height,
  };
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

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
  styles: {
    popover: (base: any) => ({
      ...base,
      '--reactour-accent': '#072365',
      borderRadius: 5,
    }),
    controls: (base: any) => ({ ...base, marginTop: 30 }),
  },
  onClickMask: ({ setIsOpen }: { setIsOpen: Function }) => setIsOpen(false),
  onClickClose: ({ setIsOpen }: { setIsOpen: Function }) => setIsOpen(false),
  steps: [
    {
      selector: '.search',
      content: 'Search for blocks, transactions, and addresses with the Finder block explorer.',
    },
    {
      selector: '.Contracts',
      page: '/',
      content: 'Interact with contracts you have imported from your terrain project.',
    },
    {
      selector: '.Accounts',
      page: '/Accounts',
      content: 'Find addresses and seed phrases for pre-baked test accounts.',
    },
    {
      selector: '.Blocks',
      page: '/Blocks',
      content: 'See incoming blocks and their respective events.',
    },
    {
      selector: '.Transactions',
      page: '/Transactions',
      content: 'See more information about incoming transactions.',
    },
    {
      selector: '.Logs',
      page: '/Logs',
      content: 'View incoming logs from LocalTerra.',
    },
    {
      selector: '.Settings',
      content: 'Manage your settings here. Like open at login, your LocalTerra path, and your desired block time.',
    },
    {
      selector: '.current-block',
      page: '/',
      content: 'This is the current block of your LocalTerra instance. If it it\'s not incrementing then LocalTerra is not running.',
    },
    {
      selector: '.toggle-terra',
      content: 'Click this button to toggle (pause and resume) LocalTerra.',
    },
    {
      selector: '.add-contracts',
      content: 'Click here to import contracts from your Terrain project to call them from Terrarium.',
    },
    {
      selector: '.contract-view',
      content: 'This is the contract view of pre-baked contract',
    },
    {
      selector: '#pre-baked-contract-0',
      content: 'This is a method on the cw-20 token base contract that ships with LocalTerra. Call your execute and query methods here.',
    },
  ],
};
