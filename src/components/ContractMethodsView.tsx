import React from 'react';
import { MsgExecuteContract } from '@terra-money/terra.js';
import Form from '@rjsf/material-ui';
import { Button } from '@mui/material';
import { useTerra } from '../package/hooks';

function ObjectFieldTemplate(props: any) {
  return (
    <div className="py-4">
      <div className="text-xl">{props.title}</div>
      {props.description}
      {props.properties.map((element: any) => <div key={element.key} className="property-wrapper">{element.content}</div>)}
    </div>
  );
}

const ContractMethodsView = ({ schemas, contractAddress, walletName }: any) => {
  const { terra, wallets } = useTerra();
  const [contractRes, setContractRes] = React.useState(null);
  const wallet = wallets[walletName];

  const queryContract = async ({ formData }: any) => {
    const res = await terra.wasm.contractQuery(contractAddress, formData) as any;
    setContractRes(res);
  };

  const executeContract = async ({ formData }: any) => {
    const execMsg = await wallet.createAndSignTx({
      msgs: [
        new MsgExecuteContract(
          wallet.key.accAddress,
          contractAddress,
          formData,
        ),
      ],
    });
    const res = await terra.tx.broadcast(execMsg) as any;
    setContractRes(res);
  };

  return (
    <>
      {schemas.map((schema: any) => (
        <Form
          schema={schema}
          ObjectFieldTemplate={ObjectFieldTemplate}
          key={schema.required[0]}
          className="border-t-2 mb-2 border-blue-900"
          onSubmit={schema.msgType === 'execute' ? executeContract : queryContract}
        >
          <Button variant="contained" type="submit">{schema.msgType}</Button>
        </Form>
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
