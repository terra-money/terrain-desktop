import React from "react"
import { ITerraConfig } from "../interface/ITerraConfig";
import { LCDClient } from "@terra-money/terra.js"
export const TerraContext = React.createContext({});
export const TerraSocketContext = React.createContext({})
const config : ITerraConfig = {
    url: "http://localhost:1317",
    chainId: "phoenix-1"
}

export function Provider(props : {children : any, config ?: ITerraConfig}) {
    const terra = React.useMemo(() => {
        return new LCDClient({
            URL: props.config?.url || config.url,
            chainID: props.config?.chainId || config.chainId
        })
    }, [])

    // const ws = React.useMemo(() => {
    //     return new WebSocket()
    // }, [])
    
    return (
        <TerraContext.Provider value={terra}>
            {/* <TerraSocketContext.Provider value={ws}> */}
                {props.children}
            {/* </TerraSocketContext.Provider> */}
        </TerraContext.Provider>
    )
}