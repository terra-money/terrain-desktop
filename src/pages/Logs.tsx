import React from 'react';
import { useGetLogs } from '../package/hooks';
import LogView from '../component/LogView';

export default function LogsPage() {
  return (
    <ul className="w-full flex flex-col">
      {useGetLogs().map((log) => (<LogView log={log} />))}
    </ul>
  );
}
