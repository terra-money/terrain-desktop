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
  schemas: Object[] | null,
  address: string,
  wallet: Wallet,
  setIsLoading: Function
  isLoading: boolean
}) => {
  const { terra } = useTerra();
  const [contractRes, setContractRes] = useState({});
  const [targetIndex, setTargetIndex] = useState<number>();

  const handleResClose = () => setTargetIndex(undefined);

  const handleQuery = async (msgData: Object) => {
    setContractRes(await terra.wasm.contractQuery(address, msgData));
  };

  const handleExecute = async (msgData: Object) => {
    const execMsg = await wallet.createAndSignTx({
      msgs: [new MsgExecuteContract(wallet.key.accAddress, address, msgData)],
    });
    setContractRes(await terra.tx.broadcast(execMsg));
  };

  const handleSubmit = (msgType: string, index: number) => async ({ formData }: any) => {
    try {
      setTargetIndex(index);
      setIsLoading(true);
      if (msgType === 'query') await handleQuery(formData);
      else await handleExecute(formData);
    } catch (err) {
      setContractRes(err as Error);
    }
    setIsLoading(false);
  };

  const handleGenericQuery = async (query: string) => {
    try {
      setTargetIndex(-1);
      setIsLoading(true);
      await handleQuery(JSON.parse(query));
    } catch (err) {
      setContractRes(err as Error);
    }
    setIsLoading(false);
  };

  const ContractResponse = () => (
    <>
      {JSON.stringify(contractRes) !== '{}' && !isLoading && (
      <div className="flex flex-col center-items mb-2">
        <CloseIcon onClick={handleResClose} className="cursor-pointer w-4" />
        <ReactJson
          collapsed={1}
          src={contractRes}
        />
      </div>
      )}
    </>
  );

  return (
    <>
      <GenericContractCall handleGenericQuery={handleGenericQuery} />
      {targetIndex === -1 && (<ContractResponse />)}
      {schemas && schemas.map((schema: any, index: number) => (
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
              className="bg-blue-500 border-blue-700 hover:bg-terra-dark-blue text-white font-bold py-2 px-4 border rounded uppercase"
              type="submit"
            >
              {schema.msgType}
            </button>
          </Form>
          {index === targetIndex && (<ContractResponse />)}
        </>
      ))}
    </>
  );
};

export default React.memo(ContractMethodsView);
