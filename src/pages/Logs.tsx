import React from 'react';
import { useGetLogs } from '../package/hooks';
import LogView from '../component/LogView';

export default function LogsPage() {
  return (
    <ul className="flex flex-col max-h-screen overflow-y-scroll">
      {useGetLogs().map((log) => (<LogView log={log} />))}
    </ul>
  );
}
