import React from 'react';
import { PageProps } from '../../types';

type Event = {
  id: number;
  descriptor: string;
};

type Props = PageProps & {
  events: Event[];
};

const EventIndex: React.FC<Props> = ({ events }) => (
  <div>
    <h1>Events</h1>
    <ul>
      {events?.map((event) => (
        <li key={event.id}>{event.descriptor}</li>
      ))}
    </ul>
  </div>
);

export default EventIndex;
