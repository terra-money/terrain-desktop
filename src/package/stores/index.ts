import { createState } from '@hookstate/core';
import { BlockInfo, TxInfo } from '@terra-money/terra.js';

export const blockState = createState<BlockInfo[]>([]);
export const txState = createState<TxInfo[]>([]);

window.ipcRenderer.on('NewBlock', ((_: any, block : BlockInfo) => {
  blockState.merge([{ ...block }]);
}));

window.ipcRenderer.on('Tx', (_: any, tx : TxInfo) => {
  console.log('tx', tx);
  txState.merge([{ ...tx }]);
});
