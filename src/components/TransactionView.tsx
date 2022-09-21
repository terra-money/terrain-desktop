import { Collapse } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TerrariumTx } from '../models/TerrariumTx';
import { ReactComponent as ExternalLinkIcon } from '../assets/external-link.svg';
import EventInfo from './EventInfo';
import { truncate } from '../utils';
import { REACT_APP_FINDER_URL } from '../constants';

const TransactionView = ({
  data, index, onToggleEventDetails, width,
}: {
  data: TerrariumTx,
  index: number,
  onToggleEventDetails: (_index: number) => void,
  width: number,
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
      <li
        className="bg-white grid justify-between items-center shadow-row rounded-2xl border-2 border-blue-200"
        style={{
          gridTemplateColumns: `${width < 1050 ? '125px' : '200px'} ${
            width < 1024 ? width > 899 ? '180px' : width > 767 ? '150px' : '110px' : width > 1400 ? '500px' : '280px'
          } ${width < 1024 ? '90px' : '1fr'} minmax(100px, 2fr) 0.5fr`,
        }}
      >
        <div className="bg-blue-200 p-5 px-2 lg:p-5 rounded-l-xl">
          <a
            className="flex items-center text-sm lg:text-base text-blue-700 font-semibold hover:text-blue-500 hover:underline"
            target="_blank"
            href={txHref}
            rel="noreferrer"
          >
            <div className="mr-2">
              {width < 1050 ? truncate(txhash, [4, 4]) : truncate(txhash, [6, 6])}
            </div>
            <ExternalLinkIcon />
          </a>
        </div>
        <div className="flex justify-center items-center px-1 md:px-3 text-sm lg:text-lg">
          <div className="overflow-ellipsis overflow-hidden">
            {data.msg['@type']}
          </div>
        </div>
        <div className="flex justify-center items-center px-1 md:px-3 text-sm lg:text-lg">
          {height}
        </div>
        <div className="flex justify-center items-center px-1 md:px-3 text-sm lg:text-lg">
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
        <div className="flex justify-end pr-2 pl-0 lg:px-5">
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

export default React.memo(TransactionView);
