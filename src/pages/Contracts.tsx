import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { SelectChangeEvent } from '@mui/material/Select';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { SelectWallet, ContractsTable, LinearLoad } from '../components';
import { useTerra } from '../hooks/terra';
import {
  IMPORT_SAVED_CONTRACTS, IMPORT_NEW_CONTRACTS, DELETE_CONTRACT, REFRESH_CONTRACT_REFS,
} from '../constants';

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { wallets, terra } = useTerra();
  const [walletName, setWalletName] = useState('test1');
  const [contractCallResponseByAddress, setContractCallResponseByAddress] = useState({});

  const wallet = wallets[walletName];

  useEffect(() => {
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

  const handleWalletChange = (event: SelectChangeEvent) => setWalletName(event.target.value);

  const handleQuery = async (msgData: Object, address: string) => {
    try {
      setIsLoading(true);
      const res = await terra.wasm.contractQuery(address, msgData) as any;
      setContractCallResponseByAddress({
        ...contractCallResponseByAddress,
        [address]: JSON.stringify(res, null, 2),
      });
    } catch (err) {
      setContractCallResponseByAddress({
        ...contractCallResponseByAddress,
        [address]: JSON.stringify(err),
      });
    }
    setIsLoading(false);
  };

  const handleExecute = async (msgData: Object, address: string) => {
    try {
      setIsLoading(true);
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
      setContractCallResponseByAddress({
        ...contractCallResponseByAddress,
        [address]: JSON.stringify(res, null, 2),
      });
    } catch (err) {
      setContractCallResponseByAddress({
        ...contractCallResponseByAddress,
        [address]: JSON.stringify(err),
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-88px)] md:h-[calc(100vh-92px)] xl:h-[calc(100vh-96px)]">
      <div className="bg-white flex flex-row w-full text-left items-center px-4 py-5 gap-8 text-blue-600 shadow-nav">
        <SelectWallet
          walletName={walletName}
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
      {isLoading && <LinearLoad />}
      <ContractsTable
        handleDeleteContract={handleDeleteContract}
        handleQuery={handleQuery}
        handleExecute={handleExecute}
        handleRefreshRefs={handleRefreshRefs}
        contracts={contracts}
        contractCallResponseByAddress={contractCallResponseByAddress}
      />
    </div>
  );
}

export default React.memo(ContractsPage);
