import React from 'react';
import Form from '@rjsf/core';
import { MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { useTerra } from '../package/hooks';

const ContractMethodsView = ({ schemas, contractAddress }: any) => {
  const { terra, wallets } = useTerra();
  const [contractRes, setContractRes] = React.useState(null);

  const queryContract = async ({ formData }: any) => {
    const res = await terra.wasm.contractQuery(contractAddress, { ...formData }) as any;
    setContractRes(res);
  };

  const executeContract = async ({ formData }: any) => {
    const execMsg = await wallets.test1.createAndSignTx({
      msgs: [
        new MsgExecuteContract(
          wallets.test1.key.accAddress,
          contractAddress,
            { ...formData } as any,
        ),
      ],
      fee: new Fee(2000000, '1000000uluna'),
    });
    const res = await terra.tx.broadcast(execMsg) as any;
    setContractRes(res);
  };

  return (
    <>
      {schemas.map((schema: any) => (
        <Form
          schema={schema}
          key={schema.title}
          onSubmit={schema.msgType === 'ExecuteMsg' ? executeContract : queryContract}
        />
      ))}
      {contractRes && <pre>{JSON.stringify(contractRes, null, 2)}</pre>}
    </>
  );
};

export default React.memo(ContractMethodsView);
