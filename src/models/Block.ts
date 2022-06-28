import { BlockInfo } from '@terra-money/terra.js';

export interface TerrariumBlock {
  blocks: BlockInfo[]
  latestHeight: number
}
