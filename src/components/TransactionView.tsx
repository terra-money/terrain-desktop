import { Collapse } from '@mui/material';
import React from 'react';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { TerrariumTx } from '../models/TerrariumTx';
import { ReactComponent as ExternalLinkIcon } from '../assets/external-link.svg';
import EventInfo from './EventInfo';
import { truncate } from '../utils';
import { REACT_APP_FINDER_URL } from '../constants';

const TransactionView = ({
  data, index, onToggleEventDetails, gridTemplateColumns,
}: {
  data: TerrariumTx,
  index: number,
  gridTemplateColumns: string,
  onToggleEventDetails: (_index: number) => void,
}) => {
  const { txhash, result, height } = data.TxResult;
  const txHref = `${REACT_APP_FINDER_URL}/tx/${txhash}`;
  const isLiteMode = window.store.getLiteMode();

  const [open, setOpen] = React.useState(data.hasEventsOpenInUi);

  const toggleEventsRow = () => {
    setOpen(!open);
    onToggleEventDetails(index);
  };

  const percentGasUsed = 100 * (Number(result.gas_used) / Number(result.gas_wanted));

  return (
    <ul className="m-2">
      <li
        className="cursor-pointer bg-white grid shadow-row rounded-2xl border-2 border-blue-200"
        style={{ gridTemplateColumns }}
        onClick={toggleEventsRow}
      >
        <div className="p-5 px-2 lg:p-5 rounded-l-xl">
          <a
            className={`${isLiteMode && 'pointer-events-none'} flex items-center text-sm lg:text-base text-blue-700 font-semibold hover:text-blue-500 hover:underline`}
            target="_blank"
            href={txHref}
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mr-2">
              {truncate(txhash, [6, 6])}
            </div>
            {!isLiteMode && <ExternalLinkIcon />}
          </a>
        </div>
        <div className="flex items-center px-1 md:px-3 text-sm lg:text-md">
          <div className="text-ellipsis overflow-hidden">
            {data.msg['@type']}
          </div>
        </div>
        <div className="flex justify-center items-center px-1 md:px-3 text-sm lg:text-md">
          {height}
        </div>
        <div className="flex items-center px-1 md:px-3 text-sm lg:text-md">
          {result.gas_wanted}
          /
          {result.gas_used}
          (
          {percentGasUsed.toFixed(2)}
          %)
        </div>
        <div className="flex items-center justify-end pr-2 pl-0 lg:px-5">
          <KeyboardArrowDownIcon
            className={open ? 'rotate-180' : 'rotate-0'}
          />
        </div>
      </li>

      <li className={`rounded-2xl shadow-row ${open ? 'border-2 border-blue-200 rounded-2xl' : ''}`}>
        <Collapse in={open} timeout="auto" unmountOnExit className="px-16 py-8">
          <EventInfo title="Events" events={result.events} />
        </Collapse>
      </li>
    </ul>
  );
};

export default React.memo(TransactionView);
