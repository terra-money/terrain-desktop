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

  const gridTemplateColumns = '500px 1fr 1fr';

  return (
    <div className="flex flex-col w-full">
      <div
        className="bg-white shadow-nav grid w-full px-4 py-5 pl-8 text-blue-600 z-30"
        style={{ gridTemplateColumns }}
      >
        <div className="text-md lg:text-lg font-bold uppercase">Address</div>
        <div className="px-5 text-md lg:text-lg font-bold uppercase">
          Luna
        </div>
        <div className="flex justify-end px-5 text-md lg:text-lg font-bold uppercase">
          Key
        </div>
      </div>
      <Virtuoso
        className="flex flex-col w-full"
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
