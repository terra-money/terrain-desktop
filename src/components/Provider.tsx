import React from 'react';
import { LocalTerra } from '@terra-money/terra.js';
import { ITerraConfig } from '../models/TerraConfig';

export const TerraContext = React.createContext({});

const defaultConfig: ITerraConfig = {
  url: 'http://localhost:1317',
  chainId: 'localterra',
};

const Provider = ({ children, config }: { children: any, config?: ITerraConfig }) => {
  const terra = React.useMemo(() => new LocalTerra(), [config]);
  return (
    <TerraContext.Provider value={terra}>
      {children}
    </TerraContext.Provider>
  );
};

Provider.defaultProps = { config: defaultConfig };

export default Provider;
