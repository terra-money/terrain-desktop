import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FaPlus } from 'react-icons/fa';
import { SelectChangeEvent } from '@mui/material/Select';
import { SelectWallet, ContractView } from '../components';
import {
  IMPORT_SAVED_CONTRACTS, IMPORT_NEW_CONTRACTS, DELETE_CONTRACT,
} from '../constants';

const CONTRACTS_HEADER = [
  {
    title: 'Name',
    className: 'w-48 p-4',
  },
  {
    title: 'Code ID',
    className: 'p-4',
  },
  {
    title: 'Address',
    className: 'w-56 p-4 pl-3 mr-36',
  },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [walletName, setWalletName] = React.useState('test1');

  const handleNewContractsImport = async () => {
    const res = await ipcRenderer.invoke(IMPORT_NEW_CONTRACTS);
    setContracts(res);
  };

  const handleDeleteContract = async (codeId: string) => {
    const res = await ipcRenderer.invoke(DELETE_CONTRACT, codeId);
    setContracts(res);
  };

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
      <div
        className="flex flex-row w-full text-left items-center px-4 py-5 gap-8 text-blue-600 shadow-nav"
        style={{ background: '#ffffffe0' }}
      >
        <SelectWallet
          walletName={walletName}
          handleWalletChange={handleWalletChange}
        />
        <button
          type="button"
          onClick={handleNewContractsImport}
          className="main-button flex items-center grow gap-2.5 py-3.5 px-5 rounded-lg text-white bg-terra-dark-blue"
        >
          <FaPlus className="flex-none w-3 text-white" />
          Add Contracts
        </button>
      </div>
      <div
        className="bg-gray-background flex justify-between text-blue-600 z-50 shadow-nav"
        style={{
          background: '#ffffffe0',
        }}
      >
        {CONTRACTS_HEADER.map((header, index) => (
          <div
            key={index}
            className={`text-lg font-bold uppercase ${header.className}`}
          >
            {header.title}
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg" />
      {contracts && (
        <Virtuoso
          followOutput
          className="flex flex-col w-full"
          data={contracts}
          itemContent={(index, data) => (
            <ContractView walletName={walletName} handleDeleteContract={handleDeleteContract} data={data} key={index} />
          )}
        />
      )}
    </div>
  );
}
