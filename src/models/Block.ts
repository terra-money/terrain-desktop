import { BlockInfo } from '@terra-money/terra.js';
import { Event } from './Event';

export interface TerrariumBlocks {
  blocks: TerrariumBlockInfo[]
  latestHeight: number
}

export interface TerrariumBlockInfo extends BlockInfo {
  result_begin_block: {
    events: Event[]
  },
  result_end_block: {
    events: Event[]
  },
  hasEventsOpenInUi?: boolean;
}
