import React, { useState, FormEvent } from 'react';
import AceEditor from 'react-ace';
import { isJson } from '../utils';

const ContractMethodsView = ({ handleSubmit }: { handleSubmit: Function }) => {
  const [query, setQuery] = useState<string>();
  const [data, setData] = useState<string>();
  const [error, setError] = useState<Error>();

  const ACE_PROPS = {
    mode: 'json',
    theme: 'github',
    name: 'JSON',
    width: '100%',
    height: '160px',
    autoComplete: 'off',
    className: 'form-control',
    showGutter: false,
    highlightActiveLine: false,
    editorProps: { $blockScrolling: true },
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setData(await handleSubmit(data));
    } catch (err) {
      setError(err as Error);
    }
  };

  return (
    <section>
      <form onSubmit={submit}>
        <h2>QueryMsg JSON</h2>

        <AceEditor
          {...ACE_PROPS}
          defaultValue={query}
          onChange={(value: string) => setQuery(value)}
          onLoad={(editor: any) => {
            editor.renderer.setPadding(15);
            editor.renderer.setScrollMargin(15, 15, 15, 15);
            editor.focus();
            editor.selectAll();
          }}
        />

        <button
          disabled={!isJson(query)}
          type="submit"
        >
          Next
        </button>
      </form>
    </section>
  );
};

export default React.memo(ContractMethodsView);
