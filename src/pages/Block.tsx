import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { BlockView } from '../component';
import { useGetBlocks } from '../package/hooks';

export default function BlockPage() {
  const { blocks } = useGetBlocks();

  return (
    <ScrollToBottom className="w-full flex flex-col">
      {blocks.map((block, index) => (<BlockView key={index} block={block} />))}
    </ScrollToBottom>
  );
}
