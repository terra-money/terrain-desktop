import React from 'react';
import { Virtuoso } from 'react-virtuoso'
import  Block from '../component/Block';
import { useGetBlocks } from '../package/hooks';

const BLOCKS_HEADER = [{
  title: "Number",
  className: "w-32 p-4"
},{
  title: "Time",
  className: "w-80 p-4"
},  {
  title: "Transactions",
  className: "p-4"
}, {
  title: "Gas used",
  className: "p-4"
},{
  title: "",
  className: "m-8"
}];

export default function BlocksPage() {
  const { get, set } = useGetBlocks();
  const data = get();


  const toggleEventDetails = (index: number) => {
    data.blocks[index].hasEventsOpenInUi = !data.blocks[index].hasEventsOpenInUi;
    set(data);
  };

  return (
    <div className='flex flex-col w-full'>
      <div className='bg-gray-background flex justify-between'>
        {BLOCKS_HEADER.map((header, index) => (
          <div key={index} className={header.className}>{header.title}</div>
        ))}
      </div>
      <div className='bg-white' style={{flexGrow: 1}}>
      <Virtuoso className="flex flex-col w-full"
        followOutput
        initialTopMostItemIndex={data.blocks.length}
        data={data.blocks}
        itemContent={(index, block) => <Block onToggleEventDetails={toggleEventDetails} data={block} index={index} key={index}  />} />
      </div>
    </div>
  );
}
