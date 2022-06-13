import React from 'react';
import TransactionView from '../component/TransactionView';
import { useGetTxs } from '../package';

export default function TransactionPage() {
  return (
    <ul className="w-full flex flex-col">
      {useGetTxs().map((tx) => (<TransactionView tx={tx} />))}
    </ul>
  );
}
