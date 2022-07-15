import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FaTrash } from 'react-icons/fa';

import { ContractView } from '../component';

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

  useEffect(() => {
    importSavedContracts();
  }, []);


  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-items-end my-3 mx-3 h-19">
        <button
          type="button"
          onClick={handleRefsImport}
          className="grow px-5 rounded-lg text-white bg-terra-dark-blue"
        >
          Add Contracts
        </button>
        <button type="button" onClick={handleRefsDeletion}>
          <FaTrash className="flex-none w-15 text-terra-dark-blue mx-5" />
        </button>
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
          itemContent={(index, data) => <ContractView data={data} key={index} />}
        />
      )}
    </div>
  );
}
