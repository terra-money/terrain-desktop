import React from 'react';
import { Downgraded } from '@hookstate/core';
import BlockView from '../component/BlockView';
import { blockState } from '../package/stores';

export default function BlockPage() {
  const blocks = blockState.attach(Downgraded).get();

  return (
    <ul className="w-full flex flex-col">
      {blocks.reverse().map((b) => (<BlockView block={b} />))}
    </ul>
  );
}
