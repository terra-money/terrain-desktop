import React, { useEffect, useState } from 'react';
import { Collapse } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTour } from '@reactour/tour';
import { SmartContract } from '../models/Contract';
import { ReactComponent as ExternalLinkIcon } from '../assets/external-link.svg';
import { REACT_APP_FINDER_URL } from '../constants';
import ContractMethodsView from './ContractMethodsView';
import { truncate } from '../utils';

const ContractView = ({
  handleDeleteContract, handleQuery, handleExecute, handleRefreshRefs, data, width,
}:{
    data: SmartContract
    handleDeleteContract: Function
    handleQuery: Function
    handleExecute: Function
    handleRefreshRefs: Function
    width: number
}) => {
  const {
    name, codeId, address, schemas, path,
  } = data;

  const [open, setOpen] = useState(false);
  const [truncatedAddress, setTruncatedAddress] = useState(address);
  const toggleContractRow = () => setOpen(!open);
  const { isOpen, currentStep } = useTour();

  useEffect(() => {
    if (isOpen && currentStep >= 10) setOpen(true);
  }, [currentStep]);

  useEffect(() => {
    if (width >= 1750) {
      setTruncatedAddress(address);
    } else if (width <= 835) {
      setTruncatedAddress(truncate(address, [6, 4]));
    } else if (width <= 1010) {
      setTruncatedAddress(truncate(address, [8, 8]));
    } else if (width <= 1310) {
      setTruncatedAddress(truncate(address, [14, 14]));
    } else if (width <= 1750) {
      setTruncatedAddress(truncate(address, [20, 20]));
    }
  }, [width]);

  return (
    <ul className="m-2">
      <li
        className="bg-white contract-view grid items-center shadow-row rounded-2xl border-2 border-blue-200"
        style={{
          gridTemplateColumns: `${
            width <= 767
              ? '160px'
              : width > 1400
                ? '300px'
                : width < 1170
                  ? '200px'
                  : '255px'
          } minmax(90px, 1fr) 2fr minmax(116px, 0.75fr)`,
        }}
      >
        <div className="rounded-l-xl">
          <a
            className="flex items-center text-blue-700 font-semibold text-sm md:text-base hover:text-blue-500 hover:underline rounded-l-xl"
            target="_blank"
            href={`${REACT_APP_FINDER_URL}/address/${address}`}
            rel="noreferrer"
          >
            <div className="bg-blue-200 px-2 py-8 md:pl-4 overflow-ellipsis overflow-hidden">
              {name}
            </div>
            <div className="bg-blue-200 pr-4 py-9 md:py-[38px]">
              <ExternalLinkIcon />
            </div>
          </a>
        </div>
        <div className="flex justify-center items-center px-1 md:px-3 text-sm md:text-lg">
          {codeId}
        </div>
        <div className="flex justify-center items-center px-1 md:px-3 text-sm md:text-lg">
          {truncatedAddress}
        </div>
        <div className="flex justify-end pl-5">
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
            <div className="p-4 pl-2">
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
              handleQuery={handleQuery}
              handleExecute={handleExecute}
              schemas={schemas}
              address={address}
            />
          </Collapse>
        </li>
      )}
    </ul>
  );
};
export default React.memo(ContractView);
