import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import BlockView from '../component/BlockView';
import { useGetBlocks } from '../package/hooks';

export default function BlockPage() {
  const { blocks } = useGetBlocks();
  return (
    <ScrollToBottom className="w-full flex flex-col max-h-screen overflow-y-scroll">
      {blocks.map((b) => (<BlockView block={b} />))}
    </ScrollToBottom>
  );
}
