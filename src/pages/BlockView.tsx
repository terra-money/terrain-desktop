import { BlockInfo } from '@terra-money/terra.js';
import React from 'react';
import { useGetTxFromHeight } from '../package';

function BlockItemView({ block } : {block : BlockInfo}) {
  const txInfos = useGetTxFromHeight(parseInt(block.block.header.height, 10));
  const dateString = (new Date(block.block.header.time)).toDateString();
  let gasUsed: number = 0;
  txInfos.forEach(({ gas_used: gas } : { gas_used: number }) => { gasUsed += gas; });

  return (
    <button type="button" className="w-full text-right flex">
      <div className="w-1/12 bg-blue-200 px-2 text-center py-2">
        <p className="text-xs text-blue-800 font-bold">Block Number</p>
        <p className="text-blue-800">{block.block.header.height}</p>
      </div>
      <div className="w-11/12 flex justify-between px-4">
        <div>
          <p>Mined</p>
          <p>{dateString}</p>
        </div>
        <div>
          <p>Gas Used</p>
          <p>{gasUsed}</p>
        </div>
        <div>
          <p>Transactions</p>
          <p>{txInfos.length}</p>
        </div>
      </div>
    </button>
  );
}

export default React.memo(BlockItemView);
