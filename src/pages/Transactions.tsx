import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import Transaction from '../components/Transaction';
import { useTxs } from '../package';

const TRANSACTIONS_HEADER = [{
  title: 'Hash',
  className: 'w-52 p-4',
}, {
  title: 'Type',
  className: 'w-96 p-4',
}, {
  title: 'Block',
  className: 'p-4 pl-3',
}, {
  title: 'Gas Requested / Used ',
  className: 'p-4',
}, {
  title: '',
  className: 'm-4',
}];

export default function TransactionsPage() {
  const { get: getTxs, set: setTxs } = useTxs();
  const txs = getTxs();

  if (txs.length === 0) {
    return (
      <div className="flex w-full items-center justify-center">
        <h1 className="text-2xl font-bold text-blue-800 uppercase">
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
        className="flex flex-row w-full text-left items-center px-4 justify-between text-blue-600 font-bold z-50"
        style={{
          background: '#ffffffe0',
          boxShadow: '0px 1px 4px 0px rgb(50 50 50 / 75%)',
        }}
      >
        {TRANSACTIONS_HEADER.map((header, index) => (
          <div key={index} className={`text-lg uppercase ${header.className}`}>
            {header.title}
          </div>
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
