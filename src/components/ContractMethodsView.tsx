import React, { useState } from 'react';
import Form from '@rjsf/material-ui';
import { Button } from '@mui/material';
import { MsgExecuteContract, Wallet } from '@terra-money/terra.js';
import ReactJson from 'react-json-view';
import { useTerra } from '../hooks/terra';

function ObjectFieldTemplate(props: any) {
  if (props.properties.length === 0) { return null; }
  return (
    <div className="py-6">
      <div className="text-2xl capitalize text-blue-700 font-semibold">
        {props.title}
      </div>
      {props.description}
      {props.properties.map((element: any) => (
        <div key={element.name} className="property-wrapper">
          {element.content}
        </div>
      ))}
    </div>
  );
}

const ContractMethodsView = ({
  schemas, address, wallet, setIsLoading, isLoading,
}: {
  schemas: Object[],
  address: string,
  wallet: Wallet,
  setIsLoading: Function
  isLoading: boolean
}) => {
  const { terra } = useTerra();
  const [contractRes, setContractRes] = useState({});
  const [targetIndex, setTargetIndex] = useState(0);

  const handleQuery = async (msgData: Object) => {
    try {
      const res = await terra.wasm.contractQuery(address, msgData) as any;
      setContractRes(res);
    } catch (err) {
      setContractRes(err as Error);
    }
  };

  const handleExecute = async (msgData: Object) => {
    try {
      const execMsg = await wallet.createAndSignTx({
        msgs: [
          new MsgExecuteContract(
            wallet.key.accAddress,
            address,
            msgData,
          ),
        ],
      });
      const res = await terra.tx.broadcast(execMsg) as any;
      setContractRes(res);
    } catch (err) {
      setContractRes(err as Error);
    }
  };
  const handleSubmit = (msgType: string, index: number) => async ({ formData }: any) => {
    setTargetIndex(index);
    setIsLoading(true);
    if (msgType === 'query') await handleQuery(formData);
    else await handleExecute(formData);
    setIsLoading(false);
  };

  return (
    <>
      {schemas.map((schema: any, index: number) => (
        <>
          <Form
            schema={schema}
            ObjectFieldTemplate={ObjectFieldTemplate}
            key={index}
            id={`pre-baked-contract-${index}`}
            className="border-t-2 mb-8 border-blue-900 first:border-none"
            onSubmit={handleSubmit(schema.msgType, index)}
          >
            <Button variant="contained" type="submit">
              {schema.msgType}
            </Button>
          </Form>
          {JSON.stringify(contractRes) !== '{}' && !isLoading && index === targetIndex && (
          <ReactJson
            enableClipboard
            collapsed={1}
            src={contractRes}
          />
          )}
        </>
      ))}
    </>
  );
};

export default React.memo(ContractMethodsView);
