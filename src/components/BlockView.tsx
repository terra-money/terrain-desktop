import { Collapse } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ReactComponent as ExternalLinkIcon } from '../../assets/external-link.svg';
import { useGetTxFromHeight } from '../hooks/terra';
import { TerrariumBlockInfo } from '../models';
import { REACT_APP_FINDER_URL } from '../../public/constants';
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
    <div>
      <div
        role="row"
        tabIndex={0}
        className="cursor-pointer px-10 py-5 grid items-center bg-terra-background-secondary text-terra-text font-medium
          border-b border-[#EBEFF8] shadow-very-light-border"
        style={{ gridTemplateColumns }}
        onClick={toggleBlocksRow}
      >
        <a
          href={blockHref}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-none flex items-center text-terra-link hover:underline"
          rel="noreferrer"
        >
          <div>{height}</div>
          <ExternalLinkIcon className="fill-terra-link mx-1" />
        </a>

        <div>{dateString}</div>
        <div>{txInfos.length}</div>
        <div>{gasUsed}</div>
        <div className="flex justify-end">
          <KeyboardArrowDownIcon
            className={`cursor-pointer ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </div>
      <div className="bg-white">
        <Collapse in={open} timeout="auto" unmountOnExit className="px-20 py-7">
          <EventInfo
            title="Begin block event"
            events={result_begin_block.events}
          />
        </Collapse>
      </div>
    </div>
  );
};

export default React.memo(BlockView);
