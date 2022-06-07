import React from "react"
import { ITerraConfig } from "../interface/ITerraConfig";
//import {LCDClient, LocalTerra} from "@terra-money/terra.js"
export const TerraContext = React.createContext({});
export const TerraSocketContext = React.createContext({})
const config : ITerraConfig = {
    url : "123",
    chainId: ""
}
export function Provider(props : {children : any, config ?: ITerraConfig}) {

    const terra = React.useMemo(() => {
        //@ts-ignore
        // return new Terra.LCDClient({
        //     URL: props.config?.url || config.url,
        //     chainID: props.config?.chainId || config.chainId
        // })
        return new Terra.LocalTerra()
    }, [props.config])

    const ws = React.useMemo(() => {
        // @ts-ignore
        return new Terra.WebSocketClient("ws://localhost:26657/websocket");
    }, [])
    
    return (
        <TerraContext.Provider value={terra}>
            <TerraSocketContext.Provider value={ws}>
                {props.children}
            </TerraSocketContext.Provider>
        </TerraContext.Provider>
    )
}