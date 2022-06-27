import React from 'react';
import { Virtuoso } from 'react-virtuoso'
import { AccountView } from '../component';
import { useTerra } from '../package';

export default function AccountsPage() {
  const { getTestAccounts } = useTerra();
  const accounts = getTestAccounts();

  return (
    <Virtuoso className="flex flex-col w-full"
      followOutput
      initialTopMostItemIndex={accounts.length}
      data={accounts}
      itemContent={(index, account) =>  <AccountView wallet={account} key={account.key.accAddress} />} />
  );
}
