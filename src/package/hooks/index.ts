import { LocalTerra, Wallet } from '@terra-money/terra.js';
import { useContext, useEffect, useState } from 'react';
import { Downgraded, useState as useStateHook } from '@hookstate/core';
import { ipcRenderer } from 'electron';
import { TerraContext } from '../components/Provider';
import { ITerraHook, ITerraHookBlockUpdate } from '../interface/ITerraHook';
import { localTerraStarted, localTerraPathConfigured, logsState, blockState, txState } from '../../context/ElectronContextProvider';

export function useTerra() {
  const terra = useContext(TerraContext) as LocalTerra;
  const hook: ITerraHook = {
    terra,
    wallets: terra.wallets,
    getTestAccounts(): Wallet[] {
      return Object.values(terra.wallets);
    },
  };
  return hook;
}
export function useTerraBlockUpdate() {
  const terra = useContext(TerraContext) as LocalTerra;
  const hookExport: ITerraHookBlockUpdate = {
    ...useTerra(),
    getBalance: async (address: string) => {
      const [coins] = (await terra.bank.balance(address));
      return coins.toData();
    },
    listenToAccountTx(address: string, cb: Function) {
      const listener = (_: any, tx: any) => {
        const { from_address: add } = tx.msg;
        if (add === address) { cb(add); }
      };
      ipcRenderer.on('Tx', listener);
      return () => {
        ipcRenderer.removeListener('Tx', listener);
      };
    },
  };
  const [hook, setHook] = useState(hookExport);

  useEffect(() => {
    const listener = () => {
      setHook({ ...hook });
    };
    ipcRenderer.on('NewBlock', listener);

    return () => {
      ipcRenderer.removeListener('NewBlock', listener);
    };
  }, []);
  return hook;
}

export const useBlocks = () => useStateHook(blockState);

export const useGetLatestHeight = () => {
  const blocks = useBlocks();
  const { latestHeight } = blocks.get();
  return latestHeight || 0;
};

export const useGetLogs = () => useStateHook(logsState).get();

export const useTxs = () => useStateHook(txState);

export const useLocalTerraPathConfigured = () => useStateHook(localTerraPathConfigured);

export const useLocalTerraStarted = () => useStateHook(localTerraStarted);

export function useGetTxFromHeight(height?: number) {
  const terra = useContext(TerraContext) as LocalTerra;
  const [txInfo, setInfo] = useState([]);
  useEffect(() => {
    terra.tx.txInfosByHeight(height).then((tx) => {
      setInfo(tx as never[]);
    });
  }, []);

  return txInfo;
}
