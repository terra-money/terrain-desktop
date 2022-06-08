import React from 'react';
import { LCDClient } from '@terra-money/terra.js';
import { ITerraConfig } from '../interface/ITerraConfig';

export const TerraContext = React.createContext({});
export const TerraSocketContext = React.createContext({});
const config : ITerraConfig = {
  url: 'http://localhost:1317',
  chainId: 'localterra',
};

export function Provider(props : {children : any, config: ITerraConfig}) {
  const terra = React.useMemo(() => new LCDClient({
    URL: props.config?.url || config.url,
    chainID: props.config?.chainId || config.chainId,
  }), [props.config]);

  return (
    <TerraContext.Provider value={terra}>
      {props.children}
    </TerraContext.Provider>
  );
}
