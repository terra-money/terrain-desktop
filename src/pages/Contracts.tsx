import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FaPlus } from 'react-icons/fa';
import { SelectChangeEvent } from '@mui/material/Select';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { SelectWallet, ContractView } from '../components';
import { useTerra } from '../hooks/terra';
import {
  IMPORT_SAVED_CONTRACTS, IMPORT_NEW_CONTRACTS, DELETE_CONTRACT, REFRESH_CONTRACT_REFS,
} from '../constants';
import { useWindowDimensions } from '../utils';

function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const { wallets, terra } = useTerra();
  const [walletName, setWalletName] = useState('test1');
  const [contractCallResponse, setContractCallResponse] = useState('');
  const [firstColumnSize, setFirstColumnSize] = useState(280);

  const { width } = useWindowDimensions();

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
      const res = await terra.wasm.contractQuery(address, msgData) as any;
      setContractCallResponse(res);
    } catch (err) {
      setContractCallResponse(JSON.stringify(err));
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
      setContractCallResponse(res);
    } catch (err) {
      setContractCallResponse(JSON.stringify(err));
    }
  };

  useEffect(() => {
    if (width >= 1400) {
      setFirstColumnSize(280);
    } else if (width <= 767) {
      setFirstColumnSize(155);
    } else if (width < 1170) {
      setFirstColumnSize(180);
    } else if (width < 1400) {
      setFirstColumnSize(235);
    }
  }, [width]);

  return (
    <div className="flex flex-col w-full">
      <div
        className="bg-white flex flex-row w-full text-left items-center px-4 py-5 gap-8 text-blue-600 shadow-nav"
        style={{ background: '#ffffffe0' }}
      >
        <SelectWallet
          walletName={walletName}
          handleWalletChange={handleWalletChange}
        />
        <button
          type="button"
          onClick={handleNewContractsImport}
          className="main-button add-contracts flex items-center grow gap-2.5 py-3.5 px-5 rounded-lg text-white bg-terra-dark-blue"
        >
          <FaPlus className="flex-none w-3 text-white" />
          Add Contracts
        </button>
      </div>
      <div
        className="bg-white grid items-center w-full px-4 py-5 md:pl-8 text-blue-600 font-bold z-50 shadow-nav"
        style={{
          gridTemplateColumns: `${
            firstColumnSize === 155 ? firstColumnSize : firstColumnSize - 20
          }px minmax(90px, 1fr) 2fr minmax(100px, 0.75fr)`,
        }}
      >
        <div className="text-md lg:text-lg font-bold uppercase">Name</div>
        <div className="flex justify-center px-1 md:px-3 text-md lg:text-lg font-bold uppercase">
          Code ID
        </div>
        <div className="flex justify-center px-1 md:px-3 text-md lg:text-lg font-bold uppercase">
          Address
        </div>
        <div className="flex justify-center px-5 text-md lg:text-lg font-bold uppercase" />
      </div>
      {contractCallResponse && JSON.stringify(contractCallResponse, null, 2)}
      {contracts && (
        <Virtuoso
          followOutput
          className="flex flex-col w-full"
          data={contracts}
          itemContent={(index, data) => (
            <ContractView
              handleDeleteContract={handleDeleteContract}
              handleQuery={handleQuery}
              handleExecute={handleExecute}
              handleRefreshRefs={handleRefreshRefs}
              data={data}
              key={index}
              firstColumnSize={firstColumnSize}
            />
          )}
        />
      )}
    </div>
  );
}

export default React.memo(ContractsPage);
