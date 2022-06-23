import React from 'react';
import { parseTxDescription, truncate } from '../utils';

function TransactionItemView({ tx }: { tx: any }) {
  const txHref = `${process.env.REACT_APP_FINDER_URL}/tx/${tx.txhash}`;

  return (
    <div className="w-full text-right flex">
      <a target="_blank" href={txHref} rel="noreferrer">
        <div className="w-1/12 bg-blue-200 px-2 text-center py-2">
          <p className="text-xs text-blue-800 font-bold">Hash</p>
          <p className="text-blue-800">{truncate(tx.txhash)}</p>
        </div>
      </a>
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

    </div>
  );
}

export default React.memo(TransactionItemView);
