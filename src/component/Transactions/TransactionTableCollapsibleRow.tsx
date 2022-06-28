import { Divider, List, ListItem } from '@mui/material';
import React from 'react';
import { TxEvents, TxUtils } from '../../models/TerrariumTx';

type TransactionTableCollapsibleRowType = {
  events: TxEvents[]
}

function TransactionTableCollapsibleRow(props: TransactionTableCollapsibleRowType) {
  const events = TxUtils.parseEventsAttributes(props.events);

  return (
    <>
      <h3>Events</h3>
      <List>
        {events.map((event, index) => (
            <ListItem className='overflow-auto' style={{alignItems: 'start'}} key={index}>
              <div className='text-blue-800' style={{minWidth: "160px"}}>
                <h4>{index}) {event.type}</h4>
              </div>
              <div>
                {event.attributes.map((attribute, _index) => (
                  <div key={_index}>
                    <span style={{minWidth: "60px"}} className='mr-2 min-w-60 inline-block'>{attribute.key}</span>
                    <span>{attribute.value}</span>
                  </div>
                ))}
              </div>
            {index !== events.length - 1 && <Divider />}
            </ListItem>
        ))}
      </List>
    </>
  );
}

export default React.memo(TransactionTableCollapsibleRow);
