import React, { useEffect, useState } from 'react';
import { Collapse } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTour } from '@reactour/tour';
import { Wallet } from '@terra-money/terra.js';
import { SmartContract } from '../models/Contract';
import { ReactComponent as ExternalLinkIcon } from '../assets/external-link.svg';
import { REACT_APP_FINDER_URL } from '../constants';
import ContractMethodsView from './ContractMethodsView';

const ContractView = ({
  handleDeleteContract, handleRefreshRefs, data, gridTemplateColumns, wallet, setIsLoading,
}:{
    data: SmartContract
    handleDeleteContract: Function
    handleRefreshRefs: Function
    gridTemplateColumns: string
    setIsLoading: Function
    wallet: Wallet
}) => {
  const {
    name, codeId, address, schemas, path,
  } = data;

  const [open, setOpen] = useState(false);
  const toggleContractRow = () => setOpen(!open);
  const { isOpen, currentStep } = useTour();

  useEffect(() => {
    if (isOpen && currentStep >= 10) setOpen(true);
  }, [currentStep]);

  return (
    <ul className="m-2">
      <li
        className="bg-white contract-view grid items-center shadow-row rounded-2xl border-2 border-blue-200"
        style={{ gridTemplateColumns }}
      >
        <a
          className="flex items-center text-blue-700 font-semibold text-sm md:text-base hover:text-blue-500 hover:underline rounded-l-xl"
          target="_blank"
          href={`${REACT_APP_FINDER_URL}/address/${address}`}
          rel="noreferrer"
        >
          <div className="px-2 py-8 md:pl-5 overflow-ellipsis overflow-hidden">
            {name}
          </div>
          <div className="pr-4 py-9 md:py-[38px]">
            <ExternalLinkIcon />
          </div>
        </a>

        <div className="flex items-center justify-center px-3 text-sm md:text-md">
          {codeId}
        </div>
        <div className="flex items-center px-3 text-sm md:text-md">
          {address}
        </div>
        <div className="flex justify-end pl-3">
          <button
            type="button"
            onClick={() => handleDeleteContract(codeId)}
            className="text-blue"
          >
            <DeleteIcon className="text-blue" />
          </button>
          <button
            type="button"
            onClick={() => handleRefreshRefs(path)}
            className="text-blue"
          >
            <RefreshIcon className="text-blue" />
          </button>
          {schemas && (
            <div className="p-3 pl-2">
              <KeyboardArrowDownIcon
                className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
                onClick={toggleContractRow}
              />
            </div>
          )}
        </div>
      </li>
      {schemas && (
        <li
          className={`bg-white ${
            open ? 'border-2 border-blue-200 rounded-2xl shadow-row' : ''
          }`}
        >
          <Collapse
            in={open}
            timeout="auto"
            className={`
              ${open ? 'px-16 py-8' : 'hidden'}
            `}
          >
            <ContractMethodsView
              schemas={schemas}
              setIsLoading={setIsLoading}
              address={address}
              wallet={wallet}
            />
          </Collapse>
        </li>
      )}
    </ul>
  );
};
export default React.memo(ContractView);
