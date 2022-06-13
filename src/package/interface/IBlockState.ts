import { BlockInfo } from '@terra-money/terra.js';

export interface IBlockState {
    blocks: BlockInfo[]
    latestHeight: number
  }
