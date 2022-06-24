import { createState, State } from "@hookstate/core";
import { ipcRenderer } from 'electron';
import { BlockInfo, TxInfo } from "@terra-money/terra.js";
import React, { ReactElement } from "react";
import { IBlockState } from "../package";

type TypeElectronContext = {
    localTerraPathConfigured: State<boolean>;
    localTerraStarted: State<boolean>;
    blockState: State<IBlockState>,
    txState: State<TxInfo[]>,
    logsState: State<string[]>,
}

const ElectronContext = React.createContext<TypeElectronContext>(null as any);

export const ElectronContextProvider = ({children}: {children: ReactElement}) => {
    const blockState = createState<IBlockState>({ blocks: [], latestHeight: 0 });
    const txState = createState<TxInfo[]>([]);
    const logsState = createState<string[]>([]);
    const localTerraPathConfigured = createState<boolean>(false);
    const localTerraStarted = createState<boolean>(false);


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

    ipcRenderer.on('LocalTerraRunning', ((_: any, isLocalTerraRunning: boolean) => {
        console.log('LocalTerraRunning', isLocalTerraRunning);
        localTerraStarted.set(isLocalTerraRunning);
    }));

    ipcRenderer.on('LocalTerraPath', ((_: any, isLocalTerraPathConfigured: boolean) => {
        console.log('LocalTerraPath', isLocalTerraPathConfigured);
        localTerraPathConfigured.set(isLocalTerraPathConfigured);
    }));

    return (
        <ElectronContext.Provider value={{blockState,txState,logsState,localTerraPathConfigured, localTerraStarted}}>
            {children}
        </ElectronContext.Provider>
    );
}

export default ElectronContext;