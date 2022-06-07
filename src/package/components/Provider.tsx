import React from "react"
import { ITerraConfig } from "../interface/ITerraConfig";
import { LCDClient, WebSocketClient } from "@terra-money/terra.js"
export const TerraContext = React.createContext({});
export const TerraSocketContext = React.createContext({})
const config : ITerraConfig = {
    url: "http://localhost:1317",
    chainId: "localterra"
}
export function Provider(props : {children : any, config ?: ITerraConfig}) {
    const terra = React.useMemo(() => {
        return new LCDClient({
            URL: props.config?.url || config.url,
            chainID: props.config?.chainId || config.chainId
        })
    }, [props.config])

    // const ws = React.useMemo(() => {
    //     // return new WebSocketClient("ws://localhost:26657/websocket");
    // }, [])
    
    return (
        <TerraContext.Provider value={terra}>
            {/* <TerraSocketContext.Provider value={ws}> */}
                {props.children}
            {/* </TerraSocketContext.Provider> */}
        </TerraContext.Provider>
    )
}