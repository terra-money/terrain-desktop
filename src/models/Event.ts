export interface Event {
    attributes: EventAttribute[];
    type: string;
}

export interface EventAttribute {
    key: string;
    value: string;
    index: boolean;
}

export class EventUtils {
  static parseEventsAttributes(events: Event[]): Event[] {
    return events.map((event) => {
      const attributes = event.attributes.map((attribute) => {
        const key = Buffer.from(attribute.key, 'base64').toString('utf-8');
        const value = Buffer.from(attribute.value, 'base64').toString('utf-8');

        return { ...attribute, key, value };
      });

      return { ...event, attributes };
    });
  }
}
