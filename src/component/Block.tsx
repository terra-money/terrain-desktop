import { Collapse } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ReactComponent as ExternalLinkIcon } from '../assets/icons/external-link.svg';
import { TerrariumBlockInfo, useGetTxFromHeight } from '../package';
import EventInfo from './EventInfo';

type BlockType = {
  data: TerrariumBlockInfo,
  index: number,
  onToggleEventDetails: (index: number) => void,
}

function Block(props: BlockType) {
  const { height, time } = props.data.block.header;
  const { result_begin_block} = props.data;
  const blockHref = `${process.env.REACT_APP_FINDER_URL}/blocks/${height}`;

  const [open, setOpen] = React.useState(props.data.hasEventsOpenInUi);

  const txInfos = useGetTxFromHeight(parseInt(height, 10));
  const dateString = (new Date(time)).toDateString();
  let gasUsed: number = 0;
  txInfos.forEach(({ gas_used: gas }: { gas_used: number }) => { gasUsed += gas; });

  const toggleEventsRow = () => {
    setOpen(!open)
    props.onToggleEventDetails(props.index);
  };
  
  return (
    <ul className='divide-y divide-blue-200'>
      <li className='flex justify-between items-center'>
        <div className='bg-blue-200 p-4 w-32'>
          <a href={blockHref} target="_blank" className="flex items-center text-blue-800" rel="noreferrer">
            <div className='mr-2'>{height}</div>
            <ExternalLinkIcon />
          </a>
        </div>

        <div>{dateString}</div>
        <div>{txInfos.length}</div>
        <div>{gasUsed}</div>
        <div className='p-4'>
          <KeyboardArrowDownIcon 
            className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
            onClick={() => toggleEventsRow()} />
        </div>
      </li>

      <li>
        <Collapse in={open} timeout="auto" unmountOnExit className='px-16 py-8'>
          <EventInfo title="Begin block event" events={result_begin_block.events} />
        </Collapse>
      </li>
    </ul>
  );
}

export default React.memo(Block);
