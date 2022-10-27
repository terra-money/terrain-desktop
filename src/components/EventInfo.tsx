import { Divider, List, ListItem } from '@mui/material';
import React from 'react';
import { EventUtils, Event } from '../models/Event';

const EventInfo = ({ events, title }: {
  events: Event[],
  title: string
}) => {
  const eventsAtts = EventUtils.parseEventsAttributes(events);
  return (
    <>
      <h3 className="text-xl text-terra-text font-medium mb-3">{title}</h3>
      <List>
        {eventsAtts.map((event, index) => (
          <ListItem
            className="overflow-auto ml-4"
            style={{ alignItems: 'start', flexDirection: 'column' }}
            key={index}
          >
            <div className="text-terra-text font-medium w-40 text-sm mb-2">
              <h4>
                [
                {index}
                ]
                {' '}
                {event.type}
              </h4>
            </div>
            <div>
              {event.attributes.map((attribute, _index) => (
                <div key={_index} className="ml-6 mb-1 text-sm">
                  <span
                    className="mr-5 mb-1 min-w-[63px] inline-block text-terra-link"
                  >
                    {attribute.key}
                  </span>
                  <span className="text-terra-text">{attribute.value}</span>
                </div>
              ))}
            </div>
            {index !== events.length - 1 && <Divider />}
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default React.memo(EventInfo);
