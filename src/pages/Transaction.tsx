import React from 'react';
import { Downgraded } from '@hookstate/core';
import TransactionView from '../component/TransactionView';
import { txState } from '../package/stores';

export default function TransactionPage() {
  const txs = txState.attach(Downgraded).get();
  console.log('txs', txs);
  return (
    <ul className="w-full flex flex-col">
      {txs.map((tx) => (<TransactionView tx={tx} />))}
    </ul>
  );
}
