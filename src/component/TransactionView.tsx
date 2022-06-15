import React from 'react';
import { parseTxDescription } from '../utils';

function TransactionItemView({ tx }: { tx: any }) {
  console.log('tx in transactionView: ', tx);
  return (
    <button type="button" className="w-full text-right flex">
      <div className="w-1/12 bg-blue-200 px-2 text-center py-2">
        <p className="text-xs text-blue-800 font-bold">Hash</p>
        <p className="text-blue-800">{tx.txhash.replace(/(.{7})..+/, '$1…')}</p>
      </div>
      <div className="w-11/12 flex justify-between px-4">
        <div>
          <p>Block Height</p>
          <p>{tx.height}</p>
        </div>
        <div>
          <p>Description</p>
          <p>{parseTxDescription(tx.tx)}</p>
        </div>
        <div>
          <p>Gas Used</p>
          <p>{tx.result.gas_used}</p>
        </div>

      </div>
    </button>
  );
}

export default React.memo(TransactionItemView);
