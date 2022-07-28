import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTerra } from '../hooks';

const SelectWallet = ({ handleWalletChange, walletName }: any) => {
  const { wallets } = useTerra();

  return (
    <FormControl sx={{ minWidth: 250 }} size="medium">
      <InputLabel id="wallet-label">Wallet</InputLabel>
      <Select
        label="wallet"
        value={walletName}
        onChange={handleWalletChange}
      >
        {Object.keys(wallets).map((name: any) => (<MenuItem value={name}>{name}</MenuItem>))}
      </Select>
    </FormControl>
  );
};

export default React.memo(SelectWallet);
