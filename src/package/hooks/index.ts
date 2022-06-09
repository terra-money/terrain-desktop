import {
  BlockInfo,
  LocalTerra,
  Wallet,
} from '@terra-money/terra.js';
import { useContext, useEffect, useState } from 'react';
import { TerraContext } from '../components/Provider';
import { ITerraHook } from '../interface/ITerraHook';

// const Dockerode = require('dockerode');
// const DockerodeCompose = require('dockerode-compose');

export function useTerra() {
  const terra = useContext(TerraContext) as LocalTerra;
  // const docker = new Dockerode();
  /* const compose = new DockerodeCompose();
  */
  const hookExport: ITerraHook = {
    terra,
    getTestAccounts(): Wallet[] {
      return Object.values(terra.wallets);
    },
    getBalance: async (address: string) => terra.bank.balance(address),
    listenToAccountTx(address: string, cb: Function) {
      //     ws.subscribeTx({
      //         "message.sender": address
      //     }, data => {
      //         cb(data.value)
      //     })
    },
    blocks: [],
    latestBlockHeight: 0,
  };
  const [hook, setHook] = useState(hookExport);

  useEffect(() => {
    const listener = (_: any, bi: BlockInfo) => {
      const newBlocks = [...hook.blocks, bi];
      setHook({
        ...hook,
        latestBlockHeight: parseInt(bi.block.header.height, 10),
        blocks: newBlocks,
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
  const bInfoArr: BlockInfo[] = [];
  const [state, setState] = useState({
    blocks: bInfoArr,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const listener = (_: any, bi: BlockInfo) => {
      bInfoArr.push(bi);
      setState({ ...state, blocks: bInfoArr as never[] });
    };
    window.ipcRenderer.on('NewBlock', listener);
  }, []);
  return state;
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
