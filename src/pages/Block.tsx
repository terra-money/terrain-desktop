import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useBlocks } from '../hooks/terra';
import { BlockView } from '../components';

const BLOCKS_HEADER = [{
  title: 'Number',
  className: 'w-32 p-4',
}, {
  title: 'Time',
  className: 'w-64 p-4 pl-24',
}, {
  title: 'Transactions',
  className: 'p-4 pl-32 pr-2',
}, {
  title: 'Gas used',
  className: 'p-4 pl-1',
}, {
  title: '',
  className: 'm-14 mt-4',
}];

export default function BlocksPage() {
  const [filter, setFilter] = React.useState(false);
  const { get: getBlocks, set: setBlocks } = useBlocks();
  const data = getBlocks();

  const handleToggleFilter = () => setFilter(!filter);

  const getFilteredBlocks = () => data.blocks.filter(({ block } : {block: any}) => block.data.txs!.length > 0);

  const toggleEventDetails = (index: number) => {
    data.blocks[index].hasEventsOpenInUi = !data.blocks[index].hasEventsOpenInUi;
    setBlocks(data);
  };

  return (
    <div className="flex flex-col w-full">
      <FormControlLabel
        control={<Checkbox checked={filter} onChange={handleToggleFilter} />}
        label="Filter Empty Blocks"
        className="bg-white flex flex-row w-full text-left items-center px-4 py-2 shadow-nav"
        style={{
          margin: '0px',
        }}
      />
      <div
        className="bg-white flex flex-row w-full text-left items-center px-4 justify-between text-blue-600 font-bold z-50 shadow-nav"
      >
        {BLOCKS_HEADER.map((header, index) => (
          <div key={index} className={`text-lg uppercase ${header.className}`}>
            {header.title}
          </div>
        ))}
      </div>
      <div className="bg-white" style={{ flexGrow: 1 }}>
        <Virtuoso
          className="flex flex-col w-full"
          followOutput
          initialTopMostItemIndex={data.blocks.length}
          data={filter ? getFilteredBlocks() : data.blocks}
          itemContent={(index, block) => (
            <BlockView
              onToggleEventDetails={toggleEventDetails}
              data={block}
              index={index}
              key={index}
            />
          )}
        />
      </div>
    </div>
  );
}
