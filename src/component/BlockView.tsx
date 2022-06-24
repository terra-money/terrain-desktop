import { BlockInfo } from '@terra-money/terra.js';
import React from 'react';
import { useGetTxFromHeight } from '../package';

function BlockItemView({ block }: { block: BlockInfo }) {
  const { height, time } = block.block.header;
  const txInfos = useGetTxFromHeight(parseInt(height, 10));
  const dateString = (new Date(time)).toDateString();
  let gasUsed: number = 0;
  txInfos.forEach(({ gas_used: gas }: { gas_used: number }) => { gasUsed += gas; });
  const blockHref = `${process.env.REACT_APP_FINDER_URL}/blocks/${height}`;

  return (
    <a href={blockHref} target="_blank" className="shadow-sm w-full text-right flex" rel="noreferrer">
      <div className="w-2/12 bg-blue-200/25 p-2 text-center">
        <p className="text-xs text-blue-800 font-bold">Block Number</p>
        <p className="text-blue-800">{height}</p>
      </div>
      <div className="flex w-10/12 text-center justify-around py-3">
        <div>
          <p className="rounded-full bg-terra-dark-blue/75 text-white px-2">Mined</p>
          <p>{dateString}</p>
        </div>
        <div>
          <p className="rounded-full bg-terra-dark-blue/75 text-white px-2">Gas Used</p>
          <p>{gasUsed}</p>
        </div>
        <div>
          <p className="rounded-full bg-terra-dark-blue/75 text-white px-2">Transactions</p>
          <p>{txInfos.length}</p>
        </div>
      </div>
    </a>
  );
}

export default React.memo(BlockItemView);
