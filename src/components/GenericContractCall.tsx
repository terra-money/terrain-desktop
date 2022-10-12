import React, { useState, FormEvent } from 'react';
import Form from '@rjsf/material-ui';
import { Close as CloseIcon } from '@mui/icons-material';
import { Wallet } from '@terra-money/terra.js';
import { useTerra } from '../hooks/terra';

const ContractMethodsView = ({
  address, wallet, setIsLoading, isLoading,
}: {
  address: string,
  wallet: Wallet,
  setIsLoading: Function
  isLoading: boolean
  handleQuery: Function
  handleExecute: Function
}) => {
  const { terra } = useTerra();

  const [contractRes, setContractRes] = useState({});

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
      const url = isClassic
        ? `${lcd.config.URL}/wasm/contracts/${address}/store`
        : `${lcd.config.URL}/cosmwasm/wasm/v1/contract/${address}/smart/${btoa(
          query ?? '',
        )}`;
      const params = query && isClassic && { query_msg: JSON.parse(query) };

      const { data } = await apiClient.get<{ result: any }>(url, { params });
      const result = JSON.stringify(isClassic ? data.result : data, null, 2);

      setData(result);
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <section>
      <form onSubmit={submit}>
        <h2>Contract Address</h2>
        <input readOnly value={address} />
        <h2>QueryMsg JSON</h2>

        <AceEditor
          {...ACE_PROPS}
          defaultValue={query}
          onChange={(value) => setQuery(value)}
          onLoad={(editor) => {
            editor.renderer.setPadding(15);
            editor.renderer.setScrollMargin(15, 15, 15, 15);
            editor.focus();
            editor.selectAll();
          }}
        />

        <button
          className={
          isJson(query) ? s.nextButton : c(s.nextButton, s.disabled)
        }
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
