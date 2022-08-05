import React, { useState } from 'react';
import { Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ContractViewProps } from '../models/Contract';
import { ReactComponent as ExternalLinkIcon } from '../assets/icons/external-link.svg';
import { REACT_APP_FINDER_URL } from '../constants';
import ContractMethodsView from './ContractMethodsView';
import { truncate } from '../utils';

function ContractView(props: ContractViewProps) {
  const { walletName } = props;
  const {
    name, codeId, address, path, schemas,
  } = props.data;
  const contractHref = `${REACT_APP_FINDER_URL}/address/${address}`;
  const [open, setOpen] = useState(false);

  const toggleContractRow = () => setOpen(!open);

  return (
    <ul
      className="divide-y divide-solid bg-white rounded-2xl m-2"
      style={{ boxShadow: 'rgb(156 163 175 / 45%) 0px 0px 6px 1px' }}
    >
      <li className="flex justify-between items-center">
        <div className="bg-blue-200 p-4 py-8 w-44 rounded-tl-lg rounded-bl-lg text-white">
          <a
            className="flex items-center text-blue-800 hover:underline hover:text-blue-900"
            target="_blank"
            href={contractHref}
            rel="noreferrer"
          >
            <div className="mr-2">{name}</div>
            <ExternalLinkIcon />
          </a>
        </div>
        <div className="p-4 w-96 overflow-auto">{path || '" "'}</div>
        <div className="p-4 w-24">{codeId}</div>
        <div className="flex">
          <div className="p-4 whitespace-nowrap">
            {truncate(address, [15, 15])}
          </div>
          {schemas && (
            <div className="p-4">
              <KeyboardArrowDownIcon
                className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
                onClick={toggleContractRow}
              />
            </div>
          )}
        </div>
      </li>
      {schemas && (
        <Collapse
          in={open}
          timeout="auto"
          className={`
            ${
              open
                ? 'px-16 py-8'
                : 'hidden'
            }

          `}
        >
          <ContractMethodsView
            walletName={walletName}
            schemas={schemas}
            contractAddress={address}
          />
        </Collapse>
      )}
    </ul>
  );
}
export default React.memo(ContractView);
