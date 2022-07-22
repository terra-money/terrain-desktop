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

const ContractMethodsView = ({ schemas, contractAddress }: any) => {
  const { terra, wallets } = useTerra();
  const [contractRes, setContractRes] = React.useState(null);

  const queryContract = async ({ formData }: any) => {
    const res = await terra.wasm.contractQuery(contractAddress, formData) as any;
    setContractRes(res);
  };

  const executeContract = async ({ formData }: any) => {
    const execMsg = await wallets.test1.createAndSignTx({
      msgs: [
        new MsgExecuteContract(
          wallets.test1.key.accAddress,
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
          onSubmit={schema.msgType === 'execute' ? executeContract : queryContract}
        >
          <Button type="submit">{schema.msgType}</Button>
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