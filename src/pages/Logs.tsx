import React from 'react';
import { useGetLogs } from '../package/hooks';
import { LogView } from '../component';

export default function LogsPage() {
  return (
    <ul className="flex flex-col max-h-screen overflow-y-scroll flex-wrap-reverse">
      {useGetLogs().map((log) => (<LogView log={log} />))}
    </ul>
  );
}
