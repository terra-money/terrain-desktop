import { Coins, LCDClient, Wallet } from '@terra-money/terra.js';
import { Pagination } from '@terra-money/terra.js/dist/client/lcd/APIRequester';

export interface ITerraHook {
    terra: LCDClient,
    getTestAccounts(): Wallet[]
    getBalance(address : string): Promise<[Coins, Pagination]>
    listenToAccountTx(address : string, cb : Function) : any
}
