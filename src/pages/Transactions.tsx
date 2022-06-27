import React from 'react';
import { TransactionView } from '../component';
import { useGetTxs } from '../package';

export default function TransactionsPage() {
  const txs = useGetTxs();
  if (txs.length === 0) {
    return <h1>There are no transactions yet.</h1>;
  }
  
  return (
    <ul className="max-w-full flex flex-col">
      {txs.map((tx, index) => (<TransactionView key={index} tx={tx} />))}
    </ul>
  );
}
