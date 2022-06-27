import React from 'react';
import { Virtuoso } from 'react-virtuoso'
import { BlockView } from '../component';
import { useGetBlocks } from '../package/hooks';

export default function BlockPage() {
  const { blocks } = useGetBlocks();

  return (
    <Virtuoso className="flex flex-col w-full"
      followOutput
      initialTopMostItemIndex={blocks.length}
      data={blocks}
      itemContent={(index, block) => <BlockView key={index} block={block} />} />
  );
}
