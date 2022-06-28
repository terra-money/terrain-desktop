import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React, { useEffect } from 'react';
import { TableVirtuoso } from 'react-virtuoso'
import TransactionTableRow from '../component/Transactions/TransactionTableRow';
import { useGetTxs } from '../package';

const TABLE_HEADER = [{
  title: "Type",
  className: ""
},{
  title: "Hash",
  className: ""
}, {
  title: "Block",
  className: ""
}, {
  title: "Requested gas",
  className: ""
}, {
  title: "Used gas",
  className: ""
}, {
  title: "",
  className: ""
}];

export default function TransactionsPage() {
  const {get, set} = useGetTxs();
  let txs = get();

  useEffect(()=>{
    txs = get();
    console.log(txs);
  },[get]);

  if (txs.length === 0) {
    return <h1>There are no transactions yet.</h1>;
  }

  const toggleEventDetails = (index: number) => {
    txs[index].hasEventsOpenInUi = !txs[index].hasEventsOpenInUi;
    set(txs);
  };

  return (
    <TableVirtuoso className="flex flex-col w-full"
      followOutput
      initialTopMostItemIndex={txs.length}
      data={txs}
      components={{
        Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
        Table: props => <Table className='w-full' {...props}/>,
        TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
      }}
      fixedHeaderContent={() => (
          <TableRow className='bg-gray-background'>
            {TABLE_HEADER.map((data, index) => (
              <TableCell key={index} className={data.className}>{data.title}</TableCell>
            ))}
          </TableRow>
      )}
      itemContent={(index, data) => <TransactionTableRow onToggleEventDetails={toggleEventDetails} data={data} key={index} index={index}/>} />
  );
}
