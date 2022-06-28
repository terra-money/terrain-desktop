import { Collapse, TableCell, TableRow } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TerrariumTx } from '../../models/TerrariumTx';
import { ReactComponent as ExternalLinkIcon } from '../../assets/icons/external-link.svg';
import TransactionTableCollapsibleRow from './TransactionTableCollapsibleRow';

type TransactionTableRowType = {
  data: TerrariumTx,
  index: number,
  onToggleEventDetails: (index: number) => void,
}

function TransactionTableRow(props: TransactionTableRowType) {
  const { txhash, result, height } = props.data.TxResult;
  const txHref = `${process.env.REACT_APP_FINDER_URL}/tx/${txhash}`;

  const [open, setOpen] = React.useState(props.data.hasEventsOpenInUi);

  const toggleEventsRow = () => {
    setOpen(!open)
    props.onToggleEventDetails(props.index);
  };

  const calculateUsed = () => (Number(result.gas_used) / Number(result.gas_wanted)).toFixed(2);

  const formatTxHash = () => {
    const head = txhash.slice(0, 6);
    const tail = txhash.slice(-1 * 6, txhash.length);

    return [head, tail].join('...');
  }

  return (
    <>
      <TableRow>
        <TableCell className='bg-blue-200'>{props.data.msg['@type']}</TableCell>
        <TableCell>
          <a className="flex items-center	text-blue-800" target="_blank" href={txHref} rel="noreferrer">
            <div className='mr-2'>{formatTxHash()}</div>
            <ExternalLinkIcon />
          </a>
        </TableCell>
        <TableCell>{height}</TableCell>
        <TableCell>{result.gas_wanted}</TableCell>
        <TableCell>{result.gas_used} ({calculateUsed()} %)</TableCell>
        <TableCell className=''>
          <KeyboardArrowDownIcon className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
            onClick={() => toggleEventsRow()} />
        </TableCell>
      </TableRow>
      <TableRow>
        <Collapse in={open} timeout="auto" unmountOnExit className='px-16 py-8'>
          <TransactionTableCollapsibleRow events={result.events} />
        </Collapse>
      </TableRow>
    </>
  );
}

export default React.memo(TransactionTableRow);
