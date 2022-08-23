import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { AccountView } from '../components';
import { useTerra } from '../package';

export default function AccountsPage({
  handleToggleClose,
  handleToggleOpen,
}: {
  handleToggleClose: Function;
  handleToggleOpen: Function;
}) {
  const { getTestAccounts } = useTerra();
  const accounts = getTestAccounts();

  return (
    <div className="flex flex-col w-full">
      <div
        className="bg-white shadow-nav flex flex-row w-full text-left justify-between items-center px-4 py-5 text-blue-600"
      >
        <div className="text-lg font-bold  uppercase min-w-[480px] ml-[15px]">
          Address
        </div>
        <div className="flex lg:gap-8 xl:gap-24">
          <div className="ml-6 text-lg font-bold uppercase">Luna</div>
          <div className="text-lg font-bold uppercase">Tx Count</div>
          <div className="text-lg font-bold uppercase mr-[15px]">Key</div>
        </div>
      </div>
      <Virtuoso
        className="flex flex-col w-full mt-1"
        followOutput
        initialTopMostItemIndex={accounts.length}
        data={accounts}
        itemContent={(index, account) => (
          <AccountView
            wallet={account}
            key={account.key.accAddress}
            handleToggleClose={handleToggleClose}
            handleToggleOpen={handleToggleOpen}
          />
        )}
      />
    </div>
  );
}
