import React from 'react';
import { FINDER_URL } from '../constants';

function TransactionItemView({ tx }: { tx: any }) {
  const txHref = `${FINDER_URL}/tx/${tx.txhash}`;

  return (
    <a target="_blank" href={txHref} className="w-full text-right flex" rel="noreferrer">
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
          <p>Gas Used</p>
          <p>{tx.result.gas_used}</p>
        </div>

      </div>
    </a>
  );
}

export default React.memo(TransactionItemView);
