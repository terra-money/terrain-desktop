
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
    events: TxEvents[],
    gas_used: string,
    gas_wanted: string,
    log: string,
}

export interface TxEvents {
    attributes: TxEventAttribute[];
    type: string;
}

export interface TxEventAttribute {
    key: string;
    value: string;
    index: boolean;
}

export interface TxMsg {
    '@type': string;
}

export class TxUtils {
    static parseEventsAttributes(events: TxEvents[]): TxEvents[] {
        return events.map(event => {
            const attributes = event.attributes.map(attribute => {
                const key = Buffer.from(attribute.key, 'base64').toString('utf-8');
                const value = Buffer.from(attribute.value, 'base64').toString('utf-8');

                return { ...attribute, key, value }
            });
            
            return { ...event, attributes }
        });
    }
}