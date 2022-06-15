import React from 'react';
import { useGetLogs } from '../package/hooks';
import LogView from '../component/LogView';

import './styles.css';

export default function LogsPage() {
  const logs = useGetLogs();
  return (
    <ul className="w-full flex flex-col">
      {logs.map((log) => (<LogView log={log} />))}
    </ul>
  );
}
