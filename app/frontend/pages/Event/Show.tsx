import React from 'react';
import { PageProps } from '../../types';

type Event = {
  id: number;
  descriptor: string;
};

type Props = PageProps & {
  event: Event;
};

const EventShow: React.FC<Props> = ({ event }) => (
  <div>
    <h1>Event Details</h1>
    <p>{event?.descriptor}</p>
  </div>
);

export default EventShow;
