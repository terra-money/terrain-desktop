import React from 'react';
import { Virtuoso } from 'react-virtuoso'
import { Checkbox, FormControlLabel } from '@mui/material';
import  Block from '../component/Block';
import { useBlocks } from '../package/hooks';


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
  const [ filter, setFilter ] = React.useState(false);
  const { get: getBlocks, set: setBlocks } = useBlocks();
  const data = getBlocks();

  const handleToggleFilter = () => setFilter(!filter);
  
  const getFilteredBlocks = () => data.blocks.filter(({ block }) => block.data.txs!.length > 0);

  const toggleEventDetails = (index: number) => {
    data.blocks[index].hasEventsOpenInUi = !data.blocks[index].hasEventsOpenInUi;
    setBlocks(data);
  };

  return (
    <div className='flex flex-col w-full'>
      <div className='bg-gray-background flex justify-between'>
        {BLOCKS_HEADER.map((header, index) => (
          <div key={index} className={header.className}>{header.title}</div>
        ))}
      </div>
      <div className='bg-white' style={{flexGrow: 1}}>
        <FormControlLabel
              control={<Checkbox checked={filter} onChange={handleToggleFilter} />}
              label="Filter Empty Blocks"
        />
        <Virtuoso className="flex flex-col w-full"
          followOutput
          initialTopMostItemIndex={data.blocks.length}
          data={filter ? getFilteredBlocks() : data.blocks}
          itemContent={(index, block) => <Block onToggleEventDetails={toggleEventDetails} data={block} index={index} key={index}  />} 
        />
      </div>
    </div>
  );
}
