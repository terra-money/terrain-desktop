import { TxInfo, Wallet, Denom } from '@terra-money/terra.js';
import React, { useEffect, useState } from 'react';
import { useTerra } from '../package';
import { FINDER_URL } from '../constants';
import { demicrofy } from '../utils';

function AccountView({ wallet } : { wallet : Wallet }) {
  const [balance, setBalance] = useState(0.00);
  const { getBalance, listenToAccountTx } = useTerra();
  const [txInfos, setTxInfos] = useState([]);

  const { accAddress } = wallet.key;
  const acctHref = `${FINDER_URL}/address/${accAddress}`;

  useEffect(() => {
    getBalance(accAddress).then((coins: any) => {
      const { amount } = coins.find(({ denom } : { denom: Denom }) => denom === 'uluna');
      setBalance(demicrofy(Number(amount)));
    });
  }, []);

  useEffect(() => {
    listenToAccountTx(accAddress, (tx : TxInfo) => {
      const nTx = [...txInfos, tx];
      setTxInfos(nTx as never[]);
    });
  }, [txInfos]);

  return (
    <div className="flex text-left justify-between px-4 py-2 border-b border-blue-900">
      <a href={acctHref} target="_blank" rel="noreferrer">
        <div className="flex">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase">
              Address
            </p>
            <p className="text-2xl">{accAddress}</p>
          </div>
        </div>
      </a>
      <div className="flex space-x-6">
        <div className="ml-6">
          <p className="text-xs font-bold text-blue-600 uppercase">
            Luna
          </p>
          <p className="text-xl text-blue-900">{balance}</p>
        </div>
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
    </div>
  );
}

export default React.memo(AccountView);
