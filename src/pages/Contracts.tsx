import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FaPlus } from 'react-icons/fa';
import { SelectChangeEvent } from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { SelectWallet, ContractView } from '../components';

const CONTRACTS_HEADER = [
  {
    title: 'Contract Name',
    className: 'w-48 p-4',
  },
  {
    title: 'Path',
    className: 'w-96 p-4 pl-2.5',
  },
  {
    title: 'Code ID',
    className: 'p-4',
  },
  {
    title: 'Contract Address',
    className: 'w-56 p-4 pl-3 mr-36',
  },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [walletName, setWalletName] = React.useState('test1');

  async function handleNewContractsImport() {
    const res = await ipcRenderer.invoke('ImportNewContracts');
    setContracts(res);
  }

  async function handleRefsDeletion() {
    const res = await ipcRenderer.invoke('DeleteAllContractRefs');
    setContracts(res);
  }

  async function importSavedContracts() {
    const allContracts = await ipcRenderer.invoke('ImportSavedContracts');
    setContracts(allContracts);
  }
  const handleWalletChange = (event: SelectChangeEvent) => setWalletName(event.target.value);

  useEffect(() => {
    importSavedContracts();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div
        className="flex flex-row w-full text-left items-center px-4 py-5 gap-8 text-blue-600"
        style={{
          background: '#ffffffe0',
          boxShadow: '0px 1px 4px 0px rgb(50 50 50 / 75%)',
        }}
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
        <Tooltip
          title="Delete All Contracts"
          placement="left"
          style={{ marginLeft: 'auto' }}
        >
          <IconButton type="button" onClick={() => handleRefsDeletion}>
            <DeleteIcon className="flex-none text-terra-dark-blue" />
          </IconButton>
        </Tooltip>
      </div>
      <div
        className="bg-gray-background flex justify-between text-blue-600 z-50"
        style={{
          background: '#ffffffe0',
          boxShadow: '0px 1px 4px 0px rgb(50 50 50 / 75%)',
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
            <ContractView walletName={walletName} data={data} key={index} />
          )}
        />
      )}
    </div>
  );
}
