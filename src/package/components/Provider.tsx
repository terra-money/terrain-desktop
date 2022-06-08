import React from 'react';
import { LCDClient } from '@terra-money/terra.js';
import { ITerraConfig } from '../interface/ITerraConfig';

export const TerraContext = React.createContext({});
export const TerraSocketContext = React.createContext({});
const defaultConfig : ITerraConfig = {
  url: 'http://localhost:1317',
  chainId: 'localterra',
};

export function Provider({ children, config } : {children : any, config?: ITerraConfig}) {
  const terra = React.useMemo(() => new LCDClient({
    URL: config!.url,
    chainID: config!.chainId,
  }), [config]);

  return (
    <TerraContext.Provider value={terra}>
      {children}
    </TerraContext.Provider>
  );
}

Provider.defaultProps = { config: defaultConfig };
