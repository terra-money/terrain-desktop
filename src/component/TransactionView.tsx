import React from 'react';

function TransactionItemView({ tx }: { tx: any }) {
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
          <p>Gas Used</p>
          <p>{tx.result.gas_used}</p>
        </div>

      </div>
    </button>
  );
}

export default React.memo(TransactionItemView);
