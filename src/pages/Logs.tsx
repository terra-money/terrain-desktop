import React from 'react';
import { Virtuoso } from 'react-virtuoso'
import { useGetLogs } from '../package/hooks';
import LogView from '../component/LogView';

export default function LogsPage() {
  const logs = useGetLogs();

  return (
      <Virtuoso className="flex flex-col bg-white w-full"
        initialScrollTop={logs.length * 6400}
        data={logs}
        itemContent={(index, log) => <LogView key={index} log={log} />} />
  );
} 
