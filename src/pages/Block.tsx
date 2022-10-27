import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useBlocks } from '../hooks/terra';
import { BlockView } from '../components';

export default function BlocksPage() {
  const [filter, setFilter] = React.useState(false);
  const { get: getBlocks, set: setBlocks } = useBlocks();
  const data = getBlocks();
  const gridTemplateColumns = '120px minmax(125px, 1fr) minmax(25px, 0.5fr) minmax(25px, 0.5fr) 75px';

  const handleToggleFilter = () => setFilter(!filter);

  const getFilteredBlocks = () => data.blocks.filter(({ block } : {block: any}) => block.data.txs!.length > 0);

  const toggleEventDetails = (index: number) => {
    data.blocks[index].hasEventsOpenInUi = !data.blocks[index].hasEventsOpenInUi;
    setBlocks(data);
  };

  return (
    <div className="flex flex-col w-full">
      <FormControlLabel
        control={(
          <Checkbox
            checked={filter}
            onChange={handleToggleFilter}
            classes={{ root: 'p-0' }}
          />
        )}
        label="Filter Empty Blocks"
        className="flex flex-row w-full text-left items-center px-8 py-5 gap-2 text-blue-600 m-0"
        classes={{ label: 'text-sm text-terra-text font-gotham' }}
      />
      <div
        className="bg-white grid items-center w-full px-10 py-5 text-terra-text-muted font-medium text-sm uppercase z-30 border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
      >
        <div>Number</div>
        <div>Time</div>
        <div>Transactions</div>
        <div>Gas used</div>
        <div />
      </div>
      <Virtuoso
        className="flex flex-col w-full scrollbar"
        style={{ overflow: 'overlay' }}
        followOutput
        initialTopMostItemIndex={data.blocks.length}
        data={filter ? getFilteredBlocks() : data.blocks}
        itemContent={(index, block) => (
          <BlockView
            onToggleEventDetails={toggleEventDetails}
            data={block}
            index={index}
            key={index}
            gridTemplateColumns={gridTemplateColumns}
          />
        )}
      />
    </div>
  );
}
