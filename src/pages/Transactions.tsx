import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import Transaction from '../component/Transactions/Transaction';
import { useGetTxs } from '../package';

const TABLE_HEADER = [{
  title: "Hash",
  className: "w-40 p-4"
},{
  title: "Type",
  className: "w-80 p-4"
},  {
  title: "Block",
  className: "p-4"
}, {
  title: "Gas Requested / Used ",
  className: "p-4"
},{
  title: "",
  className: "m-8"
}];

export default function TransactionsPage() {
  const { get, set } = useGetTxs();
  const txs = get();

  if (txs.length === 0) {
    return <h1>There are no transactions yet.</h1>;
  }

  const toggleEventDetails = (index: number) => {
    txs[index].hasEventsOpenInUi = !txs[index].hasEventsOpenInUi;
    set(txs);
  };

  return (
    <div className='flex flex-col w-full'>
      <div className='bg-gray-background flex justify-between'>
        {TABLE_HEADER.map((data, index) => (
          <div key={index} className={data.className}>{data.title}</div>
        ))}
      </div>
      <div className='bg-white' style={{flexGrow: 1}}>
        <Virtuoso followOutput
          className="flex flex-col w-full"
          data={txs}
          itemContent={(index, data) => <Transaction onToggleEventDetails={toggleEventDetails} data={data} key={index} index={index} />} />
      </div>
    </div>
  );
}
