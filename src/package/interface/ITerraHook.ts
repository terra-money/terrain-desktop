import {
  BlockInfo, Coins, LCDClient, Wallet,
} from '@terra-money/terra.js';

export interface ITerraHook {
    terra : LCDClient,
    latestBlockHeight:number
    getTestAccounts() : Wallet[]
    getBalance(address : string) : Promise<Coins>
    listenToAccountTx(address : string, cb : Function) : any
    blocks : BlockInfo[]
}
