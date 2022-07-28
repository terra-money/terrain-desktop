import { createState } from '@hookstate/core';
import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import { TerrariumTx } from '../models/TerrariumTx';
import { TerrariumBlockInfo, TerrariumBlocks } from '../package';

const MAX_LOG_LENGTH = 500;

export const localTerraStarted = createState<boolean | null>(null);
export const localTerraPathConfigured = createState<boolean>(!!window.store.getLocalTerraPath());
export const blockState = createState<TerrariumBlocks>({ blocks: [], latestHeight: 0 });
export const txState = createState<TerrariumTx[]>([]);
export const logsState = createState<string[]>([]);

export const StateListeners = () => {
  useEffect(() => {
    console.log('useEffect rendered');
    ipcRenderer.on('NewBlock', ((_: any, block: TerrariumBlockInfo) => {
      console.log('got new block', block);
      const bHeight = Number(block.block.header.height);
      blockState.latestHeight.set(bHeight);
      blockState.blocks.merge([{ ...block }]);
    }));

    ipcRenderer.on('Tx', (_: any, tx: TerrariumTx) => {
      txState.merge([{ ...tx }]);
    });

    ipcRenderer.on('NewLogs', (async (_: any, log: string) => {
      if (logsState.length >= MAX_LOG_LENGTH) logsState.set((p) => p.slice(1).concat(log));
      else logsState.merge([log]);
    }));

    ipcRenderer.on('LocalTerraRunning', ((_: any, isLocalTerraRunning: boolean) => {
      localTerraStarted.set(isLocalTerraRunning);
    }));

    ipcRenderer.on('LocalTerraPath', ((_: any, isLocalTerraPathConfigured: boolean) => {
      localTerraPathConfigured.set(isLocalTerraPathConfigured);
    }));

    return () => {
      ipcRenderer.removeAllListeners('NewBlock');
      ipcRenderer.removeAllListeners('Tx');
      ipcRenderer.removeAllListeners('NewLogs');
      ipcRenderer.removeAllListeners('LocalTerraRunning');
      ipcRenderer.removeAllListeners('LocalTerraPath');
    };
  }, [blockState, txState, logsState, localTerraPathConfigured, localTerraStarted]);

  return null;
};

export default StateListeners;
