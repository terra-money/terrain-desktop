import { LocalTerra, Wallet } from '@terra-money/terra.js';
import { useContext, useEffect, useState } from 'react';
import { Downgraded } from '@hookstate/core';
import { ipcRenderer } from 'electron';
import { TerraContext } from '../components/Provider';
import { ITerraHook } from '../interface/ITerraHook';
import { parseTxMsg } from '../../utils';
import {
  blockState, txState, logsState, localTerraConfig
} from '../stores';

export function useTerra() {
  const terra = useContext(TerraContext) as LocalTerra;
  const hookExport: ITerraHook = {
    terra,
    getTestAccounts(): Wallet[] {
      return Object.values(terra.wallets);
    },
    getBalance: async (address: string) => {
      const [coins] = (await terra.bank.balance(address));
      return coins.toData();
    },
    listenToAccountTx(address: string, cb: Function) {
      const listener = (_: any, tx: any) => {
        const { from_address: add } = parseTxMsg(tx.TxResult);
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

export const useGetBlocks = () => blockState.attach(Downgraded).get();
export const useGetLogs = () => logsState.attach(Downgraded).get();
export const useGetTxs = () => txState.attach(Downgraded).get();
export const useLocalTerraConfig = () => localTerraConfig.attach(Downgraded).get();

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
