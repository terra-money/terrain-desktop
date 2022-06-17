import React from 'react';
import { BlockView } from '../component';
import { useGetBlocks } from '../package/hooks';

export default function BlockPage() {
  const { blocks } = useGetBlocks();
  return (
    <ul className="w-full flex flex-col">
      {blocks.map((b) => (<BlockView block={b} />))}
    </ul>
  );
}
