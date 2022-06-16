import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useGetLogs } from '../package/hooks';
import LogView from '../component/LogView';
import './styles.css';

export default function LogsPage() {
  return (
    <ScrollToBottom className="scrollable-div" initialScrollBehavior="auto">
      {useGetLogs().map((log) => (<LogView log={log} />))}
    </ScrollToBottom>
  );
}
