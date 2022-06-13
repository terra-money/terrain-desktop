import { createState } from '@hookstate/core';
import { BlockInfo, TxInfo, TxResult } from '@terra-money/terra.js';
import { IBlockState } from '../interface';

export const blockState = createState<IBlockState>({ blocks: [], latestHeight: 0 });
export const txState = createState<TxInfo[]>([]);

window.ipcRenderer.on('NewBlock', ((_: any, block: BlockInfo) => {
  const bHeight = Number(block.block.header.height);
  blockState.latestHeight.set(bHeight);
  blockState.blocks.merge([{ ...block }]);
}));

window.ipcRenderer.on('Tx', (_: any, tx: any) => {
  txState.merge([{ ...tx.TxResult }]);
});
