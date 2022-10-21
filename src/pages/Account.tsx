import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { AccountView } from '../components';
import { useTerra } from '../hooks/terra';

export default function AccountsPage({
  handleToggleClose,
  handleToggleOpen,
}: {
  handleToggleClose: Function;
  handleToggleOpen: Function;
}) {
  const { getTestAccounts } = useTerra();
  const accounts = getTestAccounts();

  // const gridTemplateColumns = 'minmax(550px, 2fr) 1fr 0.5fr';
  const gridTemplateColumns = '500px 20px 1fr 1fr';

  return (
    <div className="flex flex-col w-full">
      <div
        className="bg-white grid items-center w-full px-10 py-5 text-terra-text-muted font-medium text-sm uppercase z-30 border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
      >
        <div>Address</div>
        <div>Luna</div>
        <div />
        <div className="flex justify-end">Key</div>
      </div>
      <Virtuoso
        className="flex flex-col w-full"
        style={{ overflow: 'overlay' }}
        followOutput
        initialTopMostItemIndex={accounts.length}
        data={accounts}
        itemContent={(index, account) => (
          <AccountView
            wallet={account}
            key={account.key.accAddress}
            handleToggleClose={handleToggleClose}
            handleToggleOpen={handleToggleOpen}
            gridTemplateColumns={gridTemplateColumns}
          />
        )}
      />
    </div>
  );
}
