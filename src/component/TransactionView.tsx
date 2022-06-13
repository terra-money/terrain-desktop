import { TxInfo } from '@terra-money/terra.js';
import React from 'react';

function TransactionItemView({ tx }: { tx: TxInfo }) {
  return (
    <button type="button" className="w-full text-right flex">
      <div className="w-1/12 bg-blue-200 px-2 text-center py-2">
        <p className="text-xs text-blue-800 font-bold">Hash</p>
        <p className="text-blue-800">{tx.txhash}</p>
      </div>
      <div className="w-11/12 flex justify-between px-4">
        <div>
          <p>Mined</p>
          <p>{tx.timestamp}</p>
        </div>
        <div>
          <p>Gas Used</p>
          <p>{tx.gas_used}</p>
        </div>

      </div>
    </button>
  );
}

export default React.memo(TransactionItemView);
