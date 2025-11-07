import React from "react";
import { PageProps } from "../../types";

type HashEvent = {
  id: number;
  descriptor: string;
};

type Props = PageProps & {
  hash_events: HashEvent[];
};

const HashEventIndex: React.FC<Props> = ({ hash_events }) => (
  <div>
    <h1>Hash Events</h1>
    <ul>
      {hash_events?.map((hash_event) => (
        <li key={hash_event.id}>{hash_event.descriptor}</li>
      ))}
    </ul>
  </div>
);

export default HashEventIndex;
