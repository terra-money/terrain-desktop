import React from 'react';
import Ansi from 'ansi-to-react';
import { useGetLogs } from '../package/hooks';
import './styles.css';

export default function LogsPage() {
  const log = useGetLogs();
  return (
    <div
      className="scrollable-div w-full flex flex-col"
      style={{
        whiteSpace: 'pre-line',
        overflowWrap: 'break-word',
      }}
    >
      <Ansi>
        {log}
      </Ansi>
    </div>
  );
}
