import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { AccountView } from '../components';
import { useTerra } from '../hooks/terra';
import { useWindowDimensions } from '../utils';

export default function AccountsPage({
  handleToggleClose,
  handleToggleOpen,
}: {
  handleToggleClose: Function;
  handleToggleOpen: Function;
}) {
  const [firstColumnSize, setFirstColumnSize] = useState(480);

  const { getTestAccounts } = useTerra();
  const accounts = getTestAccounts();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width >= 1750) {
      setFirstColumnSize(480);
    } else if (width <= 820) {
      setFirstColumnSize(190);
    } else if (width <= 1010) {
      setFirstColumnSize(230);
    } else if (width <= 1310) {
      setFirstColumnSize(345);
    } else if (width <= 1750) {
      setFirstColumnSize(450);
    }
  }, [width]);

  return (
    <div className="flex flex-col w-full">
      <div
        className="bg-white shadow-nav grid items-center w-full px-4 py-5 pl-8 text-blue-600 z-30"
        style={{
          gridTemplateColumns: `${
            firstColumnSize - 25
          }px minmax(90px, 3fr) 1fr`,
        }}
      >
        <div className="text-md lg:text-lg font-bold uppercase">Address</div>
        <div className="flex justify-center px-5 text-md lg:text-lg font-bold uppercase">
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
            firstColumnSize={firstColumnSize}
          />
        )}
      />
    </div>
  );
}
