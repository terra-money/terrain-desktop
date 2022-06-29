import { Collapse, Divider } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TerrariumTx } from '../models/TerrariumTx';
import { ReactComponent as ExternalLinkIcon } from '../assets/icons/external-link.svg';
import EventInfo from './EventInfo';

type TransactionType = {
  data: TerrariumTx,
  index: number,
  onToggleEventDetails: (index: number) => void,
}

function Transaction(props: TransactionType) {
  const { txhash, result, height } = props.data.TxResult;
  const txHref = `${process.env.REACT_APP_FINDER_URL}/tx/${txhash}`;

  const [open, setOpen] = React.useState(props.data.hasEventsOpenInUi);

  const toggleEventsRow = () => {
    setOpen(!open)
    props.onToggleEventDetails(props.index);
  };

  const calculateUsed = () => (Number(result.gas_used) / Number(result.gas_wanted)).toFixed(2);

  const formatTxHash = () => {
    const head = txhash.slice(0, 5);
    const tail = txhash.slice(-1 * 5, txhash.length);

    return [head, tail].join('...');
  }

  return (
    <ul>
      <li className='flex justify-between'>
        <div className='bg-blue-200 p-4 w-40'>
          <a className="flex items-center	text-blue-800" target="_blank" href={txHref} rel="noreferrer">
            <div className='mr-2'>{formatTxHash()}</div>
            <ExternalLinkIcon />
          </a>
        </div>
        <div className='p-4 w-80 overflow-auto'>{props.data.msg['@type']}</div>
        <div className='p-4'>{height}</div>
        <div className='p-4 text-ellipsis overflow-hidden whitespace-nowrap'>{result.gas_wanted} / {result.gas_used} ({calculateUsed()} %)</div>
        <div className='p-4'>
          <KeyboardArrowDownIcon className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
            onClick={() => toggleEventsRow()} />
        </div>
      </li>

      <li>
        <Collapse in={open} timeout="auto" unmountOnExit className='px-16 py-8'>
          <EventInfo events={result.events} />
        </Collapse>
      </li>
      <Divider />
    </ul>
  );
}

export default React.memo(Transaction);
