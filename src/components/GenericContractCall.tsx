import React, { useState, FormEvent } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/worker-json';
import 'ace-builds/webpack-resolver';
import { isJson } from '../utils';

const ContractMethodsView = ({ handleSubmit }: { handleSubmit: Function }) => {
  const [query, setQuery] = useState<string>();

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
    e.stopPropagation();
    await handleSubmit({ msgType: 'query', index: -1, customMsg: query });
  };

  return (
    <section>
      <form onSubmit={submit}>
        <AceEditor
          {...ACE_PROPS}
          className="border-blue-500 border p-4 mb-2"
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
          className={`${!isJson(query) ? 'bg-gray-200' : 'bg-gray-500 border-gray-600 hover:bg-gray-700'} text-white mb-4 font-bold py-2 px-4 border rounded uppercase`}
          disabled={!isJson(query)}
          type="submit"
        >
          Query
        </button>
      </form>
    </section>
  );
};

export default React.memo(ContractMethodsView);
