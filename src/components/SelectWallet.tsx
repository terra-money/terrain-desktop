import * as React from 'react';
import {
  FormControl, Select, MenuItem,
} from '@mui/material';
import { useTerra } from '../hooks/terra';
import { TextCopyButton } from '.';
import { truncate } from '../utils';

const SelectWallet = ({ handleWalletChange, selectedWallet }: { handleWalletChange: any, selectedWallet: string }) => {
  const { wallets } = useTerra();
  return (
    <FormControl sx={{ minWidth: 280 }} size="medium" className="custom-select">
      <Select
        label="wallet"
        value={selectedWallet}
        onChange={handleWalletChange}
        className="font-gotham text-terra-text text-sm bg-white rounded-lg"
        classes={{ select: 'rounded-lg leading-[21px] py-3.5 pr-8 pl-3' }}
      >
        {Object.keys(wallets).map((name: any) => (
          <MenuItem key={name} value={name}>
            {name}
            {'       '}
            {truncate(wallets[name].key.accAddress, [0, 8])}
            {name !== selectedWallet && <TextCopyButton text={wallets[name].key.accAddress} />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(SelectWallet);
