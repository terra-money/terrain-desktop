import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FaPlus } from 'react-icons/fa';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  SelectWallet, ContractView, LinearLoad,
} from '../components';
import { useTerra } from '../hooks/terra';
import {
  IMPORT_SAVED_CONTRACTS, IMPORT_NEW_CONTRACTS, DELETE_CONTRACT, REFRESH_CONTRACT_REFS,
} from '../constants';

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { wallets } = useTerra();
  const [selectedWallet, setSelectedWallet] = useState('validator');

  const wallet = wallets[selectedWallet];

  const gridTemplateColumns = 'minmax(150px, max-content) 100px 2.5fr 50px';

  useEffect(() => {
    const cachedWallet = window.localStorage.getItem('prevWalletSelection');
    if (cachedWallet) setSelectedWallet(cachedWallet);
    importSavedContracts();
  }, []);

  const handleNewContractsImport = async () => {
    const newContracts = await ipcRenderer.invoke(IMPORT_NEW_CONTRACTS);
    setContracts(newContracts);
  };

  const handleDeleteContract = async (codeId: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const updContracts = await ipcRenderer.invoke(DELETE_CONTRACT, codeId);
    setContracts(updContracts);
  };

  const handleRefreshRefs = async (path: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const updContracts = await ipcRenderer.invoke(REFRESH_CONTRACT_REFS, path);
    setContracts(updContracts);
  };

  const importSavedContracts = async () => {
    const savedContracts = await ipcRenderer.invoke(IMPORT_SAVED_CONTRACTS);
    setContracts(savedContracts);
  };

  const handleWalletChange = (event: SelectChangeEvent) => {
    setSelectedWallet(event.target.value);
    window.localStorage.setItem('prevWalletSelection', event.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full text-left items-center px-4 py-5 gap-4 text-blue-600">
        <SelectWallet
          selectedWallet={selectedWallet}
          handleWalletChange={handleWalletChange}
        />
        <button
          type="button"
          onClick={handleNewContractsImport}
          className="main-button tour__add-contracts flex items-center h-8 gap-2 px-5 rounded-3xl text-white font-medium text-sm bg-terra-button-primary hover:bg-[#0f40b9]"
        >
          <FaPlus className="flex-none w-2.5 text-white" />
          Add Contracts
        </button>
      </div>
      {isLoading && <LinearLoad />}
      <div
        className="bg-white grid items-center w-full px-4 py-5 md:pl-8 text-blue-600 font-bold z-50 shadow-nav"
        style={{ gridTemplateColumns }}
      >
        <div className="text-md font-bold uppercase">Name</div>
        <div className="flex text-md font-bold uppercase">Code ID</div>
        <div className="flex font-bold uppercase">Address</div>
        <div className="flex px-5 text-md font-bold uppercase" />
      </div>
      {contracts && (
        <Virtuoso
          followOutput
          className="flex flex-col w-full"
          data={contracts}
          itemContent={(index, data) => (
            <ContractView
              handleDeleteContract={handleDeleteContract}
              handleRefreshRefs={handleRefreshRefs}
              data={data}
              key={index}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              wallet={wallet}
              gridTemplateColumns={gridTemplateColumns}
            />
          )}
        />
      )}
    </div>
  );
}

export default React.memo(ContractsPage);
