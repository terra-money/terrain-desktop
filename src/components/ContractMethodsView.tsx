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
        <div key={element.key} className="property-wrapper">
          {element.content}
        </div>
      ))}
    </div>
  );
}

const ContractMethodsView = ({
  schemas, query, execute, address,
}: any) => {
  const handleSubmit = (schema: any) => ({ formData }: any) => {
    if (schema.msgType === 'query') query(formData, address);
    else execute(formData, address);
  };

  return (
    <>
      {schemas.map((schema: any) => (
        <Form
          schema={schema}
          ObjectFieldTemplate={ObjectFieldTemplate}
          key={schema.required[0]}
          className="border-t-2 mb-8 border-blue-900 first:border-none"
          onSubmit={handleSubmit(schema)}
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
