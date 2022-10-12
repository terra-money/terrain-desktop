import React, { useState } from 'react';
import Form from '@rjsf/material-ui';
import { Close as CloseIcon } from '@mui/icons-material';
import { MsgExecuteContract, Wallet } from '@terra-money/terra.js';
import ReactJson from 'react-json-view';
import { useTerra } from '../hooks/terra';
import { ObjectFieldTemplate, GenericContractCall } from '.';

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
  const [targetIndex, setTargetIndex] = useState(-1);

  const handleResClose = () => setTargetIndex(-1);

  const handleQuery = async (msgData: Object) => {
    try {
      setContractRes(await terra.wasm.contractQuery(address, msgData));
    } catch (err) {
      setContractRes(err as Error);
    }
  };

  const handleExecute = async (msgData: Object) => {
    try {
      const execMsg = await wallet.createAndSignTx({
        msgs: [new MsgExecuteContract(wallet.key.accAddress, address, msgData)],
      });
      setContractRes(await terra.tx.broadcast(execMsg));
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
      <GenericContractCall handleSubmit={handleSubmit} />
      {schemas.map((schema: any, index: number) => (
        <>
          <Form
            schema={schema}
            ObjectFieldTemplate={ObjectFieldTemplate}
            key={index}
            id={`tour__pre-baked-contract-${index}`}
            className="border-t-2 mb-8 border-blue-900 first:border-none"
            onSubmit={handleSubmit(schema.msgType, index)}
          >
            <button
              className={`${schema.msgType === 'query' ? 'bg-gray-400 border-gray-500 hover:bg-gray-700' : 'bg-blue-500 border-blue-700 hover:bg-terra-dark-blue'} 
              text-white font-bold py-2 px-4 border rounded uppercase`}
              type="submit"
            >
              {schema.msgType}
            </button>
          </Form>
          {JSON.stringify(contractRes) !== '{}' && !isLoading && index === targetIndex && (
            <div className="flex flex-col center-items mb-2">
              <CloseIcon onClick={handleResClose} className="cursor-pointer w-4" />
              <ReactJson
                collapsed={1}
                src={contractRes}
              />
            </div>
          )}
        </>
      ))}
    </>
  );
};

export default React.memo(ContractMethodsView);
