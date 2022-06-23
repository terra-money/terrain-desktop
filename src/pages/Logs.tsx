import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useGetLogs } from '../package/hooks';
import LogView from '../component/LogView';

export default function LogsPage() {
  return (
    <ScrollToBottom className="flex flex-col overflow-auto text-left bg-white m-10 p-2 w-full h-screen" initialScrollBehavior="auto">
      {useGetLogs().map((log) => (<LogView log={log} />))}
    </ScrollToBottom>
  );
}
