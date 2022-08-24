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
    <ul className="m-2">
      <li className="bg-white flex justify-between items-center shadow-row rounded-2xl border-2 border-blue-200">
        <div className="bg-blue-200 p-5 py-8 w-44 rounded-l-xl">
          <a
            className="flex items-center text-blue-700 font-semibold hover:text-blue-500 hover:underline"
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
              walletName={walletName}
              schemas={schemas}
              contractAddress={address}
            />
          </Collapse>
        </li>
      )}
    </ul>
  );
}
export default React.memo(ContractView);
