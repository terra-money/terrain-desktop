import { Divider, List, ListItem } from '@mui/material';
import React from 'react';
import { EventUtils, Event } from '../models/Event';

type EventInfoType = {
  events: Event[],
  title: string
}

function EventInfo(props: EventInfoType) {
  const events = EventUtils.parseEventsAttributes(props.events);

  return (
    <>
      <h3 className="text-2xl font-medium mb-4">{props.title}</h3>
      <List>
        {events.map((event, index) => (
          <ListItem
            className="overflow-auto ml-4"
            style={{ alignItems: 'start', flexDirection: 'column' }}
            key={index}
          >
            <div className="text-blue-800 w-40 text-lg mb-2 mt-2">
              <h4>
                [
                {index}
                ]
                {event.type}
              </h4>
            </div>
            <div>
              {event.attributes.map((attribute, _index) => (
                <div key={_index} className="ml-6">
                  <span
                    style={{ minWidth: '60px' }}
                    className="mr-2 min-w-60 inline-block text-terra-mid-blue"
                  >
                    {attribute.key}
                  </span>
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
