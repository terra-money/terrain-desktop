import { Divider, List, ListItem } from '@mui/material';
import React from 'react';
import { EventUtils, Event } from '../models/Event';

type EventInfoType = {
  events: Event[],
  title: string
}

function EventInfo(props: EventInfoType) {
  const events = EventUtils.parseEventsAttributes(props.events);

  console.log(props);

  return (
    <>
      <h3>{props.title}</h3>
      <List>
        {events.map((event, index) => (
          <ListItem className="overflow-auto" style={{ alignItems: 'start' }} key={index}>
            <div className="text-blue-800 w-40">
              <h4>[{index}] {event.type}</h4>
            </div>
            <div>
              {event.attributes.map((attribute, _index) => (
                <div key={_index}>
                  <span style={{ minWidth: '60px' }} className="mr-2 min-w-60 inline-block">{attribute.key}</span>
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

export default React.memo(EventInfo);
