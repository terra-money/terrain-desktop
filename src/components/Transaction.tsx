import { Collapse } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TerrariumTx } from '../models/TerrariumTx';
import { ReactComponent as ExternalLinkIcon } from '../assets/external-link.svg';
import EventInfo from './EventInfo';
import { truncate } from '../utils';
import { REACT_APP_FINDER_URL } from '../constants';

const Transaction = ({
  data, index, onToggleEventDetails,
}: {
  data: TerrariumTx,
  index: number,
  onToggleEventDetails: (_index: number) => void,
}) => {
  const { txhash, result, height } = data.TxResult;
  const txHref = `${REACT_APP_FINDER_URL}/tx/${txhash}`;

  const [open, setOpen] = React.useState(data.hasEventsOpenInUi);

  const toggleEventsRow = () => {
    setOpen(!open);
    onToggleEventDetails(index);
  };

  const percentGasUsed = 100 * (Number(result.gas_used) / Number(result.gas_wanted));

  return (
    <ul className="m-2">
      <li className="flex justify-between items-center shadow-row rounded-2xl border-2 border-blue-200">
        <div className="bg-blue-200 p-5 w-52 rounded-l-xl">
          <a
            className="flex items-center text-blue-700 font-semibold hover:text-blue-500 hover:underline"
            target="_blank"
            href={txHref}
            rel="noreferrer"
          >
            <div className="mr-2">{truncate(txhash)}</div>
            <ExternalLinkIcon />
          </a>
        </div>
        <div className="p-4 w-96 overflow-auto">{data.msg['@type']}</div>
        <div className="p-4">{height}</div>
        <div className="p-4 pl-10 text-ellipsis overflow-hidden whitespace-nowrap">
          {result.gas_wanted}
          /
          {result.gas_used}
          (
          {percentGasUsed.toFixed(2)}
          %)
        </div>
        <div className="p-4">
          <KeyboardArrowDownIcon
            className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
            onClick={toggleEventsRow}
          />
        </div>
      </li>

      <li
        className={`rounded-2xl shadow-row ${
          open ? 'border-2 border-blue-200 rounded-2xl' : ''
        }`}
      >
        <Collapse in={open} timeout="auto" unmountOnExit className="px-16 py-8">
          <EventInfo title="Events" events={result.events} />
        </Collapse>
      </li>
    </ul>
  );
};

export default React.memo(Transaction);
