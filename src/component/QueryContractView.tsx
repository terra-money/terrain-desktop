import React, { useState } from 'react';
import Form from "@rjsf/core";
import { useTerra } from '../package/hooks';

const QueryContractView = ({ schemas, contractAddress }: any) => {
    const { terra } = useTerra();
    const [queryParams, setQueryParams] = useState({});

    // const querySchemas = schemas.find(({ title }: { title: string }) => title === 'QueryMsg');
    // const execSchemas = schemas.find(({ title }: { title: string }) => title === 'ExecuteMsg');

    const queryContract = async () => {
        console.log('contractMsg', queryParams)
        const res = await terra.wasm.contractQuery(contractAddress, JSON.stringify(queryParams));
        console.log('res', res)
    }

    const handleFormChange = ({ formData }: any) => {
        console.log('formData', formData)
        setQueryParams(formData);
    }
 

  return (
    <>
    {schemas.map((schema: any) => 
      <Form
        schema={schema}
        onChange={handleFormChange}
        onSubmit={queryContract}
      />
    )}
    </>
  )
}

export default React.memo(QueryContractView);
