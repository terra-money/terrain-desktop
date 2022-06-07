import { BlockInfo, LCDClient, LocalTerra, Wallet, WebSocketClient } from "@terra-money/terra.js"
import React, { useContext, useEffect, useState } from "react"
import { TerraContext, TerraSocketContext } from "../components/Provider"
import { ITerraHook } from "../interface/ITerraHook"
export function useTerra() {
    const terra = useContext(TerraContext) as LCDClient
    const ws = useContext(TerraSocketContext) as WebSocketClient
    let hookExport: ITerraHook = {
        terra,
        getTestAccounts(): Wallet[] {
            // @ts-ignore (Coz is in the documentation)
            const wallet = terra["wallets"];
            return Object.values(wallet)
        },
    // @ts-ignore (Coz is in the documentation)
        getBalance: async (address: string) => {
            return terra.bank.balance(address)
        },

        listenToAccountTx(address: string, cb: Function) {
            ws.subscribeTx({
                "message.sender": address
            }, data => {
                cb(data.value)
            })
        },
        blocks: [],
        latestBlockHeight: 0
    }
    const [hook, setHook] = useState(hookExport)
    useEffect(() => {
        ws.subscribe("NewBlock", {}, data => {
            console.log('data', data)
            let bi = data.value as BlockInfo
            let newBlocks = [...hook.blocks, bi]
            setHook({ ...hook, latestBlockHeight: parseInt(bi.block.header.height), blocks: newBlocks })
        })
    }, [])
    return hook
}

export function useGetBlocks(){
    const terra = useContext(TerraContext) as LCDClient
    const ws = useContext(TerraSocketContext) as WebSocketClient
    const [state, setState] = useState({
        blocks : [],
        loading : true,
        error : null
    })
    
    useEffect(() => {
        let bInfoArr : BlockInfo[] = []
        terra.tendermint.blockInfo().then(async bi => {
            let latestHeight = parseInt(bi.block.header.height)
            if(latestHeight > 0){
                for (let index = 0; index < latestHeight; index++) {
                   let xbi = await terra.tendermint.blockInfo(index)
                    bInfoArr.push(xbi)
                }
            }
            bInfoArr.push(bi)
            setState({...state, blocks: bInfoArr as never[], loading : false})
        }).catch(err => {
            setState({...state, error : err})
        })

        ws.subscribe("NewBlock", {}, data => {
            let bi = data.value
            let nArr = [...state.blocks, bi]
            setState({...state, blocks : nArr as never[]})
        })
    }, [])

    return state
}

export function useGetTxFromHeight(height ?: number) {
    const terra = useContext(TerraContext) as LocalTerra
    const [txInfo, setInfo] = useState([])
    useEffect(() => {
        terra.tx.txInfosByHeight(height).then(tx => {
            setInfo(tx as never[])
        })
    }, [])

    return txInfo
}