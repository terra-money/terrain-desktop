import * as React from 'react';
import {
  InputLabel, FormControl, Select, MenuItem,
} from '@mui/material';
import { useTerra } from '../hooks/terra';
import { TextCopyButton } from '.';

const SelectWallet = ({ handleWalletChange, selectedWallet }: { handleWalletChange: any, selectedWallet: string }) => {
  const { wallets } = useTerra();
  return (
    <FormControl sx={{ minWidth: 250 }} size="medium" className="custom-select">
      <InputLabel id="wallet-label">Wallet</InputLabel>
      <Select label="wallet" value={selectedWallet} onChange={handleWalletChange}>
        {Object.keys(wallets).map((name: any) => (
          <MenuItem key={name} value={name}>
            {name}
            {'       ...'}
            {wallets[name].key.accAddress.slice(-5)}
            {name !== selectedWallet && <TextCopyButton text={wallets[name].key.accAddress} />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(SelectWallet);
