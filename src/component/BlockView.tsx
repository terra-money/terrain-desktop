import { BlockInfo } from '@terra-money/terra.js';
import React from 'react';
import { FINDER_URL } from '../constants';
import { useGetTxFromHeight } from '../package';

function BlockItemView({ block }: { block: BlockInfo }) {
  const { height, time } = block.block.header;
  const txInfos = useGetTxFromHeight(parseInt(height, 10));
  const dateString = (new Date(time)).toDateString();
  let gasUsed: number = 0;
  txInfos.forEach(({ gas_used: gas }: { gas_used: number }) => { gasUsed += gas; });
  const blockHref = `${FINDER_URL}/blocks/${height}`;

  return (
    <a href={blockHref} target="_blank" className="shadow-sm w-full text-right flex" rel="noreferrer">
      <div className="w-1/12 bg-blue-200/25 px-2 text-center py-2">
        <p className="text-xs text-blue-800 font-bold">Block Number</p>
        <p className="text-blue-800">{height}</p>
      </div>
      <div className="w-11/12 flex text-center justify-around py-3">
        <div flex-initial w-32>
          <p className="box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2">Mined</p>
          <p>{dateString}</p>
        </div>
        <div flex-initial w-32>
          <p className="box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2">Gas Used</p>
          <p>{gasUsed}</p>
        </div>
        <div flex-initial w-32>
          <p className="box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2">Transactions</p>
          <p>{txInfos.length}</p>
        </div>
      </div>
    </a>
  );
}

export default React.memo(BlockItemView);
