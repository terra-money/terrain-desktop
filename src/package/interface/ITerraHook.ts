import { Coins, LCDClient, Wallet } from '@terra-money/terra.js';

export interface ITerraHook {
    terra: LCDClient,
    wallets: { [key: string]: Wallet },
    getTestAccounts(): Wallet[]
    getBalance(address : string): Promise<Coins.Data>
    listenToAccountTx(address : string, cb : Function) : any
}
