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
    
    return (
        <TerraContext.Provider value={terra}>
            {props.children}
        </TerraContext.Provider>
    )
}