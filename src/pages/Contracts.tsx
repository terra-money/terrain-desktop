import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { SelectChangeEvent } from '@mui/material/Select';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { SelectWallet, ContractsTable } from '../components';
import { useTerra } from '../hooks/terra';
import {
  IMPORT_SAVED_CONTRACTS, IMPORT_NEW_CONTRACTS, DELETE_CONTRACT, REFRESH_CONTRACT_REFS,
} from '../constants';

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const { wallets, terra } = useTerra();
  const [selectedWallet, setSelectedWallet] = useState('validator');
  const [contractResByAddress, setContractResByAddress] = useState({});

  const wallet = wallets[selectedWallet];

  useEffect(() => {
    const cachedWallet = window.localStorage.getItem('prevWalletSelection');
    if (cachedWallet) setSelectedWallet(cachedWallet);
    importSavedContracts();
  }, []);

  const handleNewContractsImport = async () => {
    const newContracts = await ipcRenderer.invoke(IMPORT_NEW_CONTRACTS);
    setContracts(newContracts);
  };

  const handleDeleteContract = async (codeId: string) => {
    const updContracts = await ipcRenderer.invoke(DELETE_CONTRACT, codeId);
    setContracts(updContracts);
  };

  const handleRefreshRefs = async (path: string) => {
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

  const handleQuery = async (msgData: Object, address: string) => {
    try {
      const res = await terra.wasm.contractQuery(address, msgData) as any;
      setContractResByAddress({ ...contractResByAddress, [address]: JSON.stringify(res, null, 2) });
    } catch (err) {
      setContractResByAddress({ ...contractResByAddress, [address]: JSON.stringify(err) });
    }
  };

  const handleExecute = async (msgData: Object, address: string) => {
    try {
      const execMsg = await wallet.createAndSignTx({
        msgs: [
          new MsgExecuteContract(
            wallet.key.accAddress,
            address,
            msgData,
          ),
        ],
      });
      const res = await terra.tx.broadcast(execMsg) as any;
      setContractResByAddress({ ...contractResByAddress, [address]: JSON.stringify(res, null, 2) });
    } catch (err) {
      setContractResByAddress({ ...contractResByAddress, [address]: JSON.stringify(err) });
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-88px)] md:h-[calc(100vh-92px)] xl:h-[calc(100vh-96px)]">
      <div className="bg-white flex flex-row w-full text-left items-center px-4 py-5 gap-8 text-blue-600 shadow-nav">
        <SelectWallet
          selectedWallet={selectedWallet}
          handleWalletChange={handleWalletChange}
        />
        <button
          type="button"
          onClick={handleNewContractsImport}
          className="main-button add-contracts flex items-center gap-2.5 py-3.5 px-5 rounded-lg text-white bg-terra-dark-blue"
        >
          <FaPlus className="flex-none w-3 text-white" />
          Add Contracts
        </button>
      </div>
      <ContractsTable
        handleDeleteContract={handleDeleteContract}
        handleQuery={handleQuery}
        handleExecute={handleExecute}
        handleRefreshRefs={handleRefreshRefs}
        contracts={contracts}
        contractResByAddress={contractResByAddress}
      />
    </div>
  );
}

export default React.memo(ContractsPage);
