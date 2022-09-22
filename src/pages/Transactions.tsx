import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import TransactionView from '../components/TransactionView';
import { useTxs } from '../hooks/terra';
import { useWindowDimensions } from '../utils';

export default function TransactionsPage() {
  const { get: getTxs, set: setTxs } = useTxs();
  const txs = getTxs();
  const { width } = useWindowDimensions();

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
        className="bg-white shadow-nav grid w-full items-center py-5 pl-8 pr-3 text-blue-600 font-bold z-30"
        style={{
          gridTemplateColumns: `${width < 1050 ? '102px' : '178px'} ${
            width < 1024
              ? width > 899
                ? '180px'
                : width > 767
                  ? '150px'
                  : '110px'
              : width > 1400
                ? '500px'
                : '280px'
          } ${width < 1024 ? '90px' : '1fr'} minmax(100px, 2fr) 0.5fr`,
        }}
      >
        <div className="text-md lg:text-lg font-bold uppercase">Hash</div>
        <div className="flex justify-center px-1 md:px-3 text-md lg:text-lg font-bold uppercase">
          Type
        </div>
        <div className="flex justify-center px-1 md:px-3 text-md lg:text-lg font-bold uppercase">
          Block
        </div>
        <div className="flex justify-center px-1 md:px-3 text-md lg:text-lg font-bold uppercase">
          {width <= 920 ? 'Gas Req/Used' : 'Gas Requested / Used'}
        </div>
        <div className="flex justify-center px-1 md:px-3 text-md lg:text-lg font-bold uppercase" />
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
              width={width}
            />
          )}
        />
      </div>
    </div>
  );
}
