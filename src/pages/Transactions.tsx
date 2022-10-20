import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import TransactionView from '../components/TransactionView';
import { useTxs } from '../hooks/terra';

export default function TransactionsPage() {
  const { get: getTxs, set: setTxs } = useTxs();
  const txs = getTxs();

  const gridTemplateColumns = '200px minmax(250px, 1fr) 100px minmax(100px, 1fr) 30px';

  if (txs.length === 0) {
    return (
      <div className="flex w-full items-center justify-center">
        <h1 className="text-xl font-bold text-terra-text uppercase">
          There are no transactions yet.
        </h1>
      </div>
    );
  }

  const toggleEventDetails = (index: number) => {
    txs[index].hasEventsOpenInUi = !txs[index].hasEventsOpenInUi;
    setTxs(txs);
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className="bg-white shadow-nav grid w-full py-5 pl-8 pr-3 text-blue-600 font-bold z-30"
        style={{ gridTemplateColumns }}
      >
        <div className="text-md lg:text-lg font-bold uppercase">Hash</div>
        <div className="px-1 md:px-3 text-md font-bold uppercase">
          Type
        </div>
        <div className="px-1 md:px-3 text-md font-bold uppercase">
          Block
        </div>
        <div className="px-1 md:px-3 text-md font-bold uppercase">
          Gas Used
        </div>
      </div>
      <div className="bg-white" style={{ flexGrow: 1 }}>
        <Virtuoso
          followOutput
          className="flex flex-col w-full"
          data={txs}
          itemContent={(index, data) => (
            <TransactionView
              onToggleEventDetails={toggleEventDetails}
              data={data}
              key={index}
              index={index}
              gridTemplateColumns={gridTemplateColumns}
            />
          )}
        />
      </div>
    </div>
  );
}
