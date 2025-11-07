import React from "react";
import { PageProps } from "../../types";

type HashEvent = {
  id: number;
  descriptor: string;
};

type Props = PageProps & {
  hash_event: HashEvent;
};

const HashEventShow: React.FC<Props> = ({ hash_event }) => (
  <div>
    <h1>Hash Event Details</h1>
    <p>{hash_event?.descriptor}</p>
  </div>
);

export default HashEventShow;
