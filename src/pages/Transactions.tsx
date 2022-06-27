import React from 'react';
import { Virtuoso } from 'react-virtuoso'
import { TransactionView } from '../component';
import { useGetTxs } from '../package';

export default function TransactionsPage() {
  const txs = useGetTxs();
  if (txs.length === 0) {
    return <h1>There are no transactions yet.</h1>;
  }

  return (
    <Virtuoso className="flex flex-col w-full"
      followOutput
      initialTopMostItemIndex={txs.length}
      data={txs}
      itemContent={(index, tx) => (<TransactionView key={index} tx={tx} />)} />
  );
}
