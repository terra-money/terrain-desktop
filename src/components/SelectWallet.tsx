import * as React from 'react';
import {
  InputLabel, FormControl, Select, MenuItem,
} from '@mui/material';
import { useTerra } from '../hooks/terra';

const SelectWallet = ({ handleWalletChange, walletName }: any) => {
  const { wallets } = useTerra();

  return (
    <FormControl sx={{ minWidth: 250 }} size="medium">
      <InputLabel id="wallet-label">Wallet</InputLabel>
      <Select
        label="wallet"
        value={walletName}
        onChange={handleWalletChange}
        className="custom-select"
      >
        {Object.keys(wallets).map((name: any) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(SelectWallet);
