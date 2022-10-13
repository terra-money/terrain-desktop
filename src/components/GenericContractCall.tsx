import React, { useState, FormEvent } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/worker-json';
import 'ace-builds/webpack-resolver';
import { isJson } from '../utils';

const GenericContractCall = ({ handleGenericQuery }: { handleGenericQuery: Function }) => {
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

  // const submit = async (e: FormEvent) => {
  //   await handleGenericQuery(query);
  // };

  return (
    <section>
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
        onClick={() => handleGenericQuery(query)}
        type="button"
      >
        Query
      </button>
    </section>
  );
};

export default React.memo(GenericContractCall);
