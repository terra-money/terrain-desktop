import { Event } from './Event';

export interface TerrariumTx {
    TxResult: TxResult;
    msg: TxMsg;
    description: string;
    hasEventsOpenInUi?: boolean;
}

export interface TxResult {
    height: string;
    result: TxSimulationResult,
    tx: string,
    txhash: string
}

export interface TxSimulationResult {
    data: string;
    events: Event[],
    gas_used: string,
    gas_wanted: string,
    log: string,
}

export interface TxMsg {
    '@type': string;
}
