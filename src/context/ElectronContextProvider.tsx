import { createState, State, useState } from "@hookstate/core";
import { ipcRenderer } from 'electron';
import React, { ReactElement, useEffect } from "react";
import { TerrariumTx } from "../models/TerrariumTx";
import { TerrariumBlockInfo, TerrariumBlocks } from "../package";


type TypeElectronContext = {
    localTerraPathConfigured: State<boolean>;
    localTerraStarted: State<boolean | null>;
    blockState: State<TerrariumBlocks>,
    txState: State<TerrariumTx[]>,
    logsState: State<string[]>,
}

const MAX_LOG_LENGTH = 500;

const ElectronContext = React.createContext<TypeElectronContext>(null as any);

export const ElectronContextProvider = ({ children } : { children: ReactElement }) => {
    const blockState = useState(createState<TerrariumBlocks>({ blocks: [], latestHeight: 0 }));
    const txState = useState(createState<TerrariumTx[]>([]));
    const logsState = useState(createState<string[]>([]));
    const localTerraPathConfigured = useState(createState<boolean>(!!window.store.getLocalTerraPath()));
    const localTerraStarted = useState(createState<boolean | null>(null));


    useEffect(() => {
        ipcRenderer.on('NewBlock', ((_: any, block: TerrariumBlockInfo) => {
            const bHeight = Number(block.block.header.height);
            blockState.latestHeight.set(bHeight);
            blockState.blocks.merge([{ ...block }]);
        }));
    
        ipcRenderer.on('Tx', (_: any, tx: TerrariumTx) => {
            txState.merge([{...tx}]);
        });
    
        ipcRenderer.on('NewLogs', (async (_: any, log: string) => {
            if (logsState.length >= MAX_LOG_LENGTH) logsState.set(p => p.slice(1).concat(log))
            else logsState.merge([log])
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
        }
    }, [blockState, txState, logsState, localTerraPathConfigured, localTerraStarted]);

    return (
        <ElectronContext.Provider value={{blockState,txState,logsState,localTerraPathConfigured, localTerraStarted}}>
            {children}
        </ElectronContext.Provider>
    );
}

export default ElectronContext;