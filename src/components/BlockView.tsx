import { Collapse } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ReactComponent as ExternalLinkIcon } from '../assets/external-link.svg';
import { useGetTxFromHeight } from '../hooks/terra';
import { TerrariumBlockInfo } from '../models';
import { REACT_APP_FINDER_URL } from '../constants';
import EventInfo from './EventInfo';

const BlockView = (props: {
  data: TerrariumBlockInfo;
  index: number;
  gridTemplateColumns: string;
  onToggleEventDetails: (index: number) => void;
}) => {
  const { height, time } = props.data.block.header;
  const { result_begin_block, hasEventsOpenInUi } = props.data;
  const { gridTemplateColumns } = props;
  const blockHref = `${REACT_APP_FINDER_URL}/blocks/${height}`;

  const [open, setOpen] = React.useState(hasEventsOpenInUi);

  const txInfos = useGetTxFromHeight(parseInt(height, 10));
  const dateString = `${new Date(time).toDateString()} | ${new Date(
    time,
  ).toLocaleTimeString()}`;

  let gasUsed: number = 0;
  txInfos.forEach(({ gas_used: gas }: { gas_used: number }) => {
    gasUsed += gas;
  });

  const toggleBlocksRow = () => {
    setOpen(!open);
    props.onToggleEventDetails(props.index);
  };

  return (
    <ul
      className="m-2"
    >
      <li
        className="bg-white grid cursor-pointer items-center shadow-row rounded-2xl border-2 border-blue-200 "
        style={{ gridTemplateColumns }}
        onClick={toggleBlocksRow}
      >
        <div
          className="bg-blue-200 p-5 px-2 md:p-5 rounded-l-xl"
        >
          <a
            href={blockHref}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center text-blue-700 font-semibold text-sm md:text-lg hover:text-blue-500 hover:underline"
            rel="noreferrer"
          >
            <div className="mr-1 md:mr-2">{height}</div>
            <ExternalLinkIcon />
          </a>
        </div>

        <div className="flex justify-center items-center px-5 text-sm md:text-[16px]">
          {dateString}
        </div>
        <div className="flex justify-center items-center px-5 text-sm md:text-lg">
          {txInfos.length}
        </div>
        <div className="flex justify-center items-center px-5 text-sm md:text-lg">
          {gasUsed}
        </div>
        <div className="flex justify-end pr-2 md:px-5">
          <KeyboardArrowDownIcon
            className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </li>

      <li
        className={`rounded-2xl shadow-row ${
          open ? 'border-2 border-blue-200 rounded-2xl' : ''
        }`}
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
