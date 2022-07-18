import React from 'react';
import { TextField, Button, FormControl } from '@mui/material';

const ContractSchemaForm = ({ schema, onSubmit }: any) => {
  const parsedQuery = schema.properties[schema.title];
  const parseQuery = (query: any) => {
    console.log('query', query);
  };
  console.log('parsedQuery', parsedQuery);
  const [formData, setFormData] = React.useState(parseQuery(schema));
  const { properties, title, msgType } = schema;
  const vars = properties[title];

  const onFormChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log('e.target', e.target);
  };

  return (
    <>
      <h2>
        {title}
      </h2>
      <h3>
        {msgType}
      </h3>
      <FormControl variant="outlined" onChange={onFormChange}>
        {vars.required && vars.required.map(() => (
          <TextField
            id={title}
            label={title}
            key={title}
          />
        ))}
        <Button onClick={() => onSubmit(formData)} type="submit">Submit</Button>
      </FormControl>
    </>
  );
};

export default React.memo(ContractSchemaForm);
