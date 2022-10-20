import { Denom } from '@terra-money/terra.js';
import React, { useEffect, useState } from 'react';
import { ReactComponent as ExternalLinkIcon } from '../assets/external-link.svg';
import { useTerraBlockUpdate, useLocalTerraStarted } from '../hooks/terra';
import { demicrofy, nFormatter } from '../utils';
import { REACT_APP_FINDER_URL } from '../constants';
import { KeyViewModal, TextCopyButton } from '.';
import { ReactComponent as KeyIcon } from '../assets/icons/menu/key.svg';

function AccountView({
  wallet,
  handleToggleClose,
  handleToggleOpen,
  gridTemplateColumns,
}: {
  wallet: any;
  handleToggleClose: Function;
  handleToggleOpen: Function;
  gridTemplateColumns: string;
}) {
  const { accAddress, mnemonic } = wallet.key;
  const [balance, setBalance] = useState(0.0);
  const { getBalance } = useTerraBlockUpdate();
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

  return (
    <div className="m-2">
      <div
        className="bg-white grid items-center shadow-row rounded-2xl border-2 border-blue-200"
        style={{ gridTemplateColumns }}
      >
        <div className="flex flex-row p-5 py-4 rounded-l-xl">
          <a
            href={`${REACT_APP_FINDER_URL}/address/${accAddress}`}
            target="_blank"
            className="flex items-center text-blue-700 mr-4 font-semibold hover:text-blue-500 hover:underline"
            rel="noreferrer"
          >
            <p className="mr-2">{accAddress}</p>
            <ExternalLinkIcon />
          </a>
        </div>
        <TextCopyButton text={accAddress} />
        <div className="flex px-8 items-center">
          <p className="text-lg font-semibold text-blue-700">
            {nFormatter(balance)}
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
          className="flex justify-end text-blue-700 hover:text-blue-500 px-5 pr-7"
        >
          <KeyIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default React.memo(AccountView);
