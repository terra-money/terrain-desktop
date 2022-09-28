import React from 'react';
import Form from '@rjsf/material-ui';
import { Button } from '@mui/material';

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
  schemas, handleQuery, handleExecute, address,
}: {
  schemas: Object[],
  handleQuery: Function,
  handleExecute: Function,
  address: string,
}) => {
  const handleSubmit = (msgType: string) => ({ formData }: any) => {
    if (msgType === 'query') handleQuery(formData, address);
    else handleExecute(formData, address);
  };

  return (
    <>
      {schemas.map((schema: any, index: number) => (
        <Form
          schema={schema}
          ObjectFieldTemplate={ObjectFieldTemplate}
          key={index}
          id={`pre-baked-contract-${index}`}
          className="border-t-2 mb-8 border-blue-900 first:border-none"
          onSubmit={handleSubmit(schema.msgType)}
        >
          <Button variant="contained" type="submit">
            {schema.msgType}
          </Button>
        </Form>
      ))}
    </>
  );
};

export default React.memo(ContractMethodsView);
