import { TxInfo, Wallet } from '@terra-money/terra.js';
import React, { useEffect, useState } from 'react';
import { useTerra } from '../package';

function AccountView({ wallet } : { wallet : Wallet }) {
  const [balance, setBalance] = useState(0.00);
  const { getBalance, listenToAccountTx } = useTerra();
  const [txInfos, setTxInfos] = useState([]);

  useEffect(() => {
    getBalance(wallet.key.accAddress).then((c: any) => {
      const luna = c.get('uluna');
      if (luna) {
        setBalance(luna.amount.toNumber());
      }
    });
  }, []);

  useEffect(() => {
    listenToAccountTx(wallet.key.accAddress, (tx : TxInfo) => {
      const nTx = [...txInfos, tx];
      setTxInfos(nTx as never[]);
    });
  }, [txInfos]);
  return (
    <button type="button" className="flex text-left justify-between px-4 py-2 border-b border-blue-900">
      <div className="flex">
        <div>
          <p className="text-xs font-bold text-blue-600 uppercase">
            Address
          </p>
          <p className="text-2xl">{wallet.key.accAddress}</p>
        </div>
        <div className="ml-6">
          <p className="text-xs font-bold text-blue-600 uppercase">
            Luna
          </p>
          <p className="text-xl text-blue-900">{balance}</p>
        </div>
      </div>
      <div className="flex space-x-6">
        <div>
          <p className="text-xs font-bold text-blue-600 uppercase">
            TX Count
          </p>
          <p className="text-xs font-bold text-blue-600 uppercase">{txInfos.length}</p>
        </div>
        <button type="button" className="text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </button>
      </div>
    </button>
  );
}

export default React.memo(AccountView);
