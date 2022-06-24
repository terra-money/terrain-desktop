import { Coins, LCDClient, Wallet } from '@terra-money/terra.js';

export interface ITerraHook {
    terra: LCDClient,
    getTestAccounts(): Wallet[]
    getBalance(address : string): Promise<Coins.Data>
    listenToAccountTx(address : string, cb : Function) : any
}
