import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import Transaction from '../components/Transaction';
import { useTxs } from '../package';

const TRANSACTIONS_HEADER = [{
  title: 'Hash',
  className: 'w-40 p-4',
}, {
  title: 'Type',
  className: 'w-90 p-4',
}, {
  title: 'Block',
  className: 'p-4',
}, {
  title: 'Gas Requested / Used ',
  className: 'p-4',
}, {
  title: '',
  className: 'm-8',
}];

export default function TransactionsPage() {
  const { get: getTxs, set: setTxs } = useTxs();
  const txs = getTxs();

  if (txs.length === 0) {
    return <h1>There are no transactions yet.</h1>;
  }

  const toggleEventDetails = (index: number) => {
    txs[index].hasEventsOpenInUi = !txs[index].hasEventsOpenInUi;
    setTxs(txs);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-gray-background flex justify-between">
        {TRANSACTIONS_HEADER.map((header, index) => (
          <div key={index} className={header.className}>{header.title}</div>
        ))}
      </div>
      <div className="bg-white" style={{ flexGrow: 1 }}>
        <Virtuoso
          followOutput
          className="flex flex-col w-full"
          data={txs}
          itemContent={(index, data) => (
            <Transaction
              onToggleEventDetails={toggleEventDetails}
              data={data}
              key={index}
              index={index}
            />
          )}
        />
      </div>
    </div>
  );
}
