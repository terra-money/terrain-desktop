import { TxInfo, Denom } from '@terra-money/terra.js';
import React, { useEffect, useState } from 'react';
import { ReactComponent as ExternalLinkIcon } from '../assets/external-link.svg';
import { useTerraBlockUpdate, useLocalTerraStarted } from '../hooks/terra';
import { demicrofy, nFormatter } from '../utils';
import { REACT_APP_FINDER_URL } from '../constants';
import { KeyViewModal } from '.';

function AccountView({
  wallet,
  handleToggleClose,
  handleToggleOpen,
}: {
  wallet: any;
  handleToggleClose: Function;
  handleToggleOpen: Function;
}) {
  const { accAddress, mnemonic } = wallet.key;

  const [balance, setBalance] = useState(0.0);
  const { getBalance, listenToAccountTx } = useTerraBlockUpdate();
  const [txInfos, setTxInfos] = useState([]);
  const hasStartedLocalTerra = useLocalTerraStarted();

  useEffect(() => {
    if (!hasStartedLocalTerra.get()) return;
    getBalance(accAddress).then((coins: any) => {
      const { amount } = coins.find(
        ({ denom }: { denom: Denom }) => denom === 'uluna',
      );
      setBalance(demicrofy(Number(amount)));
    });
  }, [hasStartedLocalTerra]);

  useEffect(() => {
    listenToAccountTx(accAddress, (tx: TxInfo) => {
      const nTx = [...txInfos, tx];
      setTxInfos(nTx as never[]);
    });
  }, [txInfos]);

  return (
    <div className="m-2">
      <div className="bg-white flex justify-between items-center shadow-row rounded-2xl border-2 border-blue-200">
        <div className="bg-blue-200 p-5 py-4 w-[475px] rounded-l-xl">
          <a
            href={`${REACT_APP_FINDER_URL}/address/${accAddress}`}
            target="_blank"
            className="flex items-center text-blue-700 font-semibold hover:text-blue-500 hover:underline"
            rel="noreferrer"
          >
            <p className="mr-2">{accAddress}</p>
            <ExternalLinkIcon />
          </a>
        </div>
        <div className="flex lg:gap-8 xl:gap-24">
          <div className="ml-6 w-[50px] flex items-center">
            <p
              className={`text-lg font-semibold text-blue-700 ${
                balance === 0 ? '' : 'ml-[-22px]'
              }`}
            >
              {nFormatter(balance)}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-lg font-semibold w-[92px] text-blue-700">
              {txInfos.length}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggleOpen(
              <KeyViewModal
                mnemonic={mnemonic}
                handleClose={handleToggleClose}
              />,
            )}
            className="text-blue-700 hover:text-blue-500 ml-2.5 p-4 pr-5"
          >
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
    </div>
  );
}

export default React.memo(AccountView);
