import { Denom } from '@terra-money/terra.js';
import React, { useEffect, useState } from 'react';
import { ReactComponent as ExternalLinkIcon } from '../assets/External-link.svg';
import { useTerraBlockUpdate, useLocalTerraStarted } from '../hooks/terra';
import { demicrofy, nFormatter } from '../utils';
import { REACT_APP_FINDER_URL } from '../constants';
import { KeyViewModal, TextCopyButton } from '.';
import { ReactComponent as KeyIcon } from '../assets/icons/key.svg';

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
    <div
      role="row"
      tabIndex={0}
      className="px-10 py-5 grid items-center bg-terra-background-secondary text-terra-text font-medium
          border-b border-[#EBEFF8] shadow-very-light-border"
      style={{ gridTemplateColumns }}
    >
      <div className="flex flex-row">
        <a
          href={`${REACT_APP_FINDER_URL}/address/${accAddress}`}
          target="_blank"
          className="flex items-center text-terra-link hover:underline"
          rel="noreferrer"
        >
          <p>{accAddress}</p>
          <ExternalLinkIcon className="fill-terra-link mx-1" />
        </a>
        <TextCopyButton text={accAddress} />
      </div>
      <p>{nFormatter(balance)}</p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => handleToggleOpen(
            <KeyViewModal
              mnemonic={mnemonic}
              handleClose={handleToggleClose}
            />,
          )}
        >
          <KeyIcon className="h-6 w-6 fill-terra-text hover:fill-terra-button-primary" />
        </button>
      </div>
    </div>
  );
}

export default React.memo(AccountView);
