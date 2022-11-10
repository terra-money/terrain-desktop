import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import TransactionView from '../components/TransactionView';
import { useTxs } from '../hooks/terra';

export default function TransactionsPage() {
  const { get: getTxs, set: setTxs } = useTxs();
  const txs = getTxs();

  const gridTemplateColumns = '150px 50px minmax(275px, 1fr) 100px minmax(100px, 1fr) 50px';

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
        className="bg-white grid items-center w-full px-10 py-5 text-terra-text-muted font-medium text-sm uppercase z-30 border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
      >
        <div>Hash</div>
        <div />
        <div>Type</div>
        <div>Block</div>
        <div>Gas Used</div>
      </div>
      <Virtuoso
        followOutput
        className="flex flex-col w-full scrollbar"
        style={{ overflow: 'overlay' }}
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
  );
}
