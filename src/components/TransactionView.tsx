import { Collapse } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TerrariumTx } from '../models/TerrariumTx';
import { ReactComponent as ExternalLinkIcon } from '../assets/External-link.svg';
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

  const [open, setOpen] = React.useState(data.hasEventsOpenInUi);

  const toggleEventsRow = () => {
    setOpen(!open);
    onToggleEventDetails(index);
  };

  const percentGasUsed = 100 * (Number(result.gas_used) / Number(result.gas_wanted));

  return (
    <div>
      <div
        role="row"
        tabIndex={0}
        className="cursor-pointer px-10 py-5 grid items-center bg-terra-background-secondary text-terra-text font-medium
          border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
        onClick={toggleEventsRow}
      >
        <a
          className="flex items-center text-terra-link hover:underline"
          target="_blank"
          href={txHref}
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <div>{truncate(txhash, [6, 6])}</div>
          <ExternalLinkIcon className="fill-terra-link mx-1" />
        </a>
        <div>{data.msg['@type']}</div>
        <div>{height}</div>
        <div className="flex items-center">
          {result.gas_wanted}
          {' '}
          /
          {' '}
          {result.gas_used}
          {' '}
          (
          {percentGasUsed.toFixed(2)}
          %)
        </div>
        <div className="flex justify-end">
          <KeyboardArrowDownIcon className={open ? 'rotate-180' : 'rotate-0'} />
        </div>
      </div>

      <div className="bg-white">
        <Collapse in={open} timeout="auto" unmountOnExit className="px-20 py-7">
          <EventInfo title="Events" events={result.events} />
        </Collapse>
      </div>
    </div>
  );
};

export default React.memo(TransactionView);
