import { createState } from '@hookstate/core';
import { BlockInfo, TxInfo } from '@terra-money/terra.js';
import { ipcRenderer } from 'electron';
import { IBlockState } from '../interface';

export const blockState = createState<IBlockState>({ blocks: [], latestHeight: 0 });
export const txState = createState<TxInfo[]>([]);
export const logsState = createState<string[]>([]);
export const localTerraState = createState<boolean>(false);

ipcRenderer.on('NewBlock', ((_: any, block: BlockInfo) => {
  const bHeight = Number(block.block.header.height);
  blockState.latestHeight.set(bHeight);
  blockState.blocks.merge([{ ...block }]);
}));

ipcRenderer.on('Tx', (_: any, tx: any) => {
  txState.merge([{ ...tx.TxResult }]);
});

ipcRenderer.on('NewLogs', ((_: any, log: string) => {
  logsState.merge([log]);
}));

ipcRenderer.on('LocalTerra', ((_: any, status: boolean) => {
  localTerraState.set(status);
}));
