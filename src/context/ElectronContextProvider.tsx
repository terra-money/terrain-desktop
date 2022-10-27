import { createState } from '@hookstate/core';
import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { TerrariumTx } from '../models/TerrariumTx';
import { TerrariumBlockInfo, TerrariumBlocks } from '../models';
import {
  MAX_LOG_LENGTH, LOCAL_TERRA_IS_RUNNING, LOCAL_TERRA_PATH_CONFIGURED, NEW_LOG, TX, NEW_BLOCK,
} from '../constants';

export const localTerraStarted = createState<boolean | null>(null);
export const localTerraPathConfigured = createState<boolean>(!!window.store.getLocalTerraPath());
export const blockState = createState<TerrariumBlocks>({ blocks: [], latestHeight: 0 });
export const txState = createState<TerrariumTx[]>([]);
export const logsState = createState<string[]>([]);

export const StateListeners = () => {
  useEffect(() => {
    ipcRenderer.on(NEW_BLOCK, ((_: any, block: TerrariumBlockInfo) => {
      blockState.latestHeight.set(Number(block.block.header.height));
      blockState.blocks.set((p) => [block, ...p]);
    }));

    ipcRenderer.on(TX, (_: any, tx: TerrariumTx) => {
      txState.merge([{ ...tx }]);
    });

    ipcRenderer.on(NEW_LOG, (async (_: any, log: string) => {
      if (logsState.length >= MAX_LOG_LENGTH) logsState.set((p) => p.slice(1).concat(log));
      else logsState.merge([log]);
    }));

    ipcRenderer.on(LOCAL_TERRA_IS_RUNNING, ((_: any, isLocalTerraRunning: boolean) => {
      localTerraStarted.set(isLocalTerraRunning);
    }));

    ipcRenderer.on(LOCAL_TERRA_PATH_CONFIGURED, ((_: any, isLocalTerraPathConfigured: boolean) => {
      localTerraPathConfigured.set(isLocalTerraPathConfigured);
    }));

    return () => {
      ipcRenderer.removeAllListeners(NEW_BLOCK);
      ipcRenderer.removeAllListeners(TX);
      ipcRenderer.removeAllListeners(NEW_LOG);
      ipcRenderer.removeAllListeners(LOCAL_TERRA_IS_RUNNING);
      ipcRenderer.removeAllListeners(LOCAL_TERRA_PATH_CONFIGURED);
    };
  }, [blockState, txState, logsState, localTerraPathConfigured, localTerraStarted]);

  return null;
};

export default StateListeners;
