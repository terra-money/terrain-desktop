import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useGetLogs } from '../package/hooks';
import LogView from '../components/LogView';

export default function LogsPage() {
  const logs = useGetLogs();

  return (
    <Virtuoso
      className="flex flex-col w-full p-4"
      followOutput
      initialTopMostItemIndex={logs.length}
      data={logs}
      itemContent={(index, log) => <LogView key={index} log={log} />}
    />
  );
}
