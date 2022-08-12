import { Collapse } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ReactComponent as ExternalLinkIcon } from '../assets/icons/external-link.svg';
import { TerrariumBlockInfo, useGetTxFromHeight } from '../package';
import { REACT_APP_FINDER_URL } from '../constants';
import EventInfo from './EventInfo';

type BlockType = {
  data: TerrariumBlockInfo,
  index: number,
  onToggleEventDetails: (index: number) => void,
}

const BlockView = (props: BlockType) => {
  const { height, time } = props.data.block.header;
  const { result_begin_block } = props.data;
  const blockHref = `${REACT_APP_FINDER_URL}/blocks/${height}`;

  const [open, setOpen] = React.useState(props.data.hasEventsOpenInUi);

  const txInfos = useGetTxFromHeight(parseInt(height, 10));
  const dateString = `${new Date(time).toDateString()} | ${new Date(time).toLocaleTimeString()}`;

  let gasUsed: number = 0;
  txInfos.forEach(({ gas_used: gas }: { gas_used: number }) => { gasUsed += gas; });

  const toggleBlocksRow = () => {
    setOpen(!open);
    props.onToggleEventDetails(props.index);
  };

  return (
    <ul className="m-2">
      <li
        className="flex justify-between items-center rounded-2xl border-2 border-blue-200"
        style={{ boxShadow: 'rgb(156 163 175 / 45%) 0px 0px 6px 1px' }}
      >
        <div className="bg-blue-200 p-5 w-32 rounded-l-xl">
          <a
            href={blockHref}
            target="_blank"
            className="flex items-center text-blue-800"
            rel="noreferrer"
          >
            <div className="mr-2">{height}</div>
            <ExternalLinkIcon />
          </a>
        </div>

        <div>{dateString}</div>
        <div>{txInfos.length}</div>
        <div>{gasUsed}</div>
        <div className="p-4">
          <KeyboardArrowDownIcon
            className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
            onClick={toggleBlocksRow}
          />
        </div>
      </li>

      <li
        className={`rounded-2xl ${
          open ? 'border-2 border-blue-200 rounded-2xl' : ''
        }`}
        style={{ boxShadow: 'rgb(156 163 175 / 45%) 0px 0px 6px 1px' }}
      >
        <Collapse in={open} timeout="auto" unmountOnExit className="px-16 py-8">
          <EventInfo
            title="Begin block event"
            events={result_begin_block.events}
          />
        </Collapse>
      </li>
    </ul>
  );
};

export default React.memo(BlockView);
