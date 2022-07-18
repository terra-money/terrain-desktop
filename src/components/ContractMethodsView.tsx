import React from 'react';
import { MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { useTerra } from '../package/hooks';
import ContractSchemaForm from './ContractSchemaForm';

const ContractMethodsView = ({ schemas, contractAddress }: any) => {
  const { terra, wallets } = useTerra();
  const [contractRes, setContractRes] = React.useState(null);

  const queryContract = async (formData: any) => {
    console.log('formData', formData);
    const res = await terra.wasm.contractQuery(contractAddress, { ...formData }) as any;
    setContractRes(res);
  };

  const executeContract = async (formData: any) => {
    console.log('formData', formData);

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
        <ContractSchemaForm
          className="mb-4"
          schema={schema}
          key={schema.title}
          onSubmit={schema.msgType === 'ExecuteMsg' ? executeContract : queryContract}
        />
      ))}
      {contractRes && (
        <>
          <h1>Result</h1>
          <pre>{JSON.stringify(contractRes, null, 2)}</pre>
        </>
      )}
    </>
  );
};

export default React.memo(ContractMethodsView);
