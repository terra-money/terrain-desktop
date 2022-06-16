import { LocalTerra, Wallet } from '@terra-money/terra.js';
import { useContext, useEffect, useState } from 'react';
import { Downgraded } from '@hookstate/core';
import { TerraContext } from '../components/Provider';
import { ITerraHook } from '../interface/ITerraHook';
import { parseTxMsg } from '../../utils';
import { blockState, txState, logsState } from '../stores';


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
      window.ipcRenderer.on('Tx', listener);
      return () => {
        window.ipcRenderer.removeListener('Tx', listener);
      };
    },
  };
  const [hook, setHook] = useState(hookExport);

  useEffect(() => {
    const listener = () => {
      setHook({
        ...hook,
      });
    };
    window.ipcRenderer.on('NewBlock', listener);

    return () => {
      window.ipcRenderer.removeListener('NewBlock', listener);
    };
  }, []);
  return hook;
}

export function useGetBlocks() {
  const blocks = blockState.attach(Downgraded).get();
  return blocks;
}

export function useGetLogs() {
  const logs = logsState.attach(Downgraded).get();
  return logs;
}

export function useGetTxs() {
  const txs = txState.attach(Downgraded).get();
  return txs;
}

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
