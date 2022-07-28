import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FaTrash } from 'react-icons/fa';
import { SelectChangeEvent } from '@mui/material/Select';
import { SelectWallet, ContractView } from '../components';
import { IMPORT_SAVED_CONTRACTS, DELETE_CONTRACT_REFS, IMPORT_NEW_CONTRACTS } from '../constants';

const CONTRACTS_HEADER = [{
  title: 'Contract Name',
  className: 'w-40 p-4',
}, {
  title: 'Path',
  className: 'w-90 p-4',
}, {
  title: 'Code ID',
  className: 'p-4',
}, {
  title: 'Contract Address',
  className: 'p-4',
}];

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [walletName, setWalletName] = React.useState('test1');

  const handleNewContractsImport = async () => {
    const res = await ipcRenderer.invoke('ImportNewContracts');
    setContracts(res);
  };

  async function handleRefsDeletion() {
    const res = await ipcRenderer.invoke(DELETE_CONTRACT_REFS);
    setContracts(res);
  }

  async function importSavedContracts() {
    const allContracts = await ipcRenderer.invoke(IMPORT_SAVED_CONTRACTS);
    setContracts(allContracts);
  }
  const handleWalletChange = (event: SelectChangeEvent) => setWalletName(event.target.value);

  useEffect(() => {
    importSavedContracts();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-items-end my-3 mx-3 h-19">
        <button
          type="button"
          onClick={handleNewContractsImport}
          className="grow px-5 rounded-lg text-white bg-terra-dark-blue"
        >
          Add Contracts
        </button>
        <button type="button" onClick={handleRefsDeletion}>
          <FaTrash className="flex-none w-15 text-terra-dark-blue mx-5" />
        </button>
        <SelectWallet walletName={walletName} handleWalletChange={handleWalletChange} />
      </div>
      <div className="bg-gray-background flex justify-between">
        {CONTRACTS_HEADER.map((header, index) => (
          <div key={index} className={header.className}>{header.title}</div>
        ))}
      </div>
      <div className="bg-white rounded-lg" />
      {contracts && (
        <Virtuoso
          followOutput
          className="flex flex-col w-full"
          data={contracts}
          itemContent={(index, data) => <ContractView walletName={walletName} data={data} key={index} />}
        />
      )}
    </div>
  );
}
