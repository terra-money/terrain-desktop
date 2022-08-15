import { Collapse } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TerrariumTx } from '../models/TerrariumTx';
import { ReactComponent as ExternalLinkIcon } from '../assets/icons/external-link.svg';
import EventInfo from './EventInfo';
import { truncate } from '../utils';
import { REACT_APP_FINDER_URL } from '../constants';

type TransactionType = {
  data: TerrariumTx,
  index: number,
  onToggleEventDetails: (index: number) => void,
}

function Transaction(props: TransactionType) {
  const { txhash, result, height } = props.data.TxResult;
  const txHref = `${REACT_APP_FINDER_URL}/tx/${txhash}`;

  const [open, setOpen] = React.useState(props.data.hasEventsOpenInUi);

  const toggleEventsRow = () => {
    setOpen(!open);
    props.onToggleEventDetails(props.index);
  };

  const percentGasUsed = 100 * (Number(result.gas_used) / Number(result.gas_wanted));

  return (
    <ul className="m-2">
      <li
        className="flex justify-between items-center rounded-2xl border-2 border-blue-200"
        style={{ boxShadow: 'rgb(156 163 175 / 45%) 0px 0px 6px 1px' }}
      >
        <div className="bg-blue-200 p-5 w-52 rounded-l-xl">
          <a
            className="flex items-center text-blue-800"
            target="_blank"
            href={txHref}
            rel="noreferrer"
          >
            <div className="mr-2">{truncate(txhash)}</div>
            <ExternalLinkIcon />
          </a>
        </div>
        <div className="p-4 w-96 overflow-auto">{props.data.msg['@type']}</div>
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
        className={`rounded-2xl ${
          open ? 'border-2 border-blue-200 rounded-2xl' : ''
        }`}
        style={{ boxShadow: 'rgb(156 163 175 / 45%) 0px 0px 6px 1px' }}
      >
        <Collapse in={open} timeout="auto" unmountOnExit className="px-16 py-8">
          <EventInfo title="Events" events={result.events} />
        </Collapse>
      </li>
    </ul>
  );
}

export default React.memo(Transaction);
