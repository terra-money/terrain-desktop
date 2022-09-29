const { ipcMain } = require('electron');
const { getSmartContractData } = require('../utils/contracts');
const { store } = require('../utils/store');
const { showSmartContractDialog, showMissingSchemaDialog } = require('../utils/messages');

const {
  DELETE_ALL_CONTRACTS, IMPORT_NEW_CONTRACTS, IMPORT_SAVED_CONTRACTS, DELETE_CONTRACT, REFRESH_CONTRACT_REFS,
} = require('../../src/constants');

module.exports = () => {
  ipcMain.handle(DELETE_ALL_CONTRACTS, () => store.deleteAllContracts());

  ipcMain.handle(DELETE_CONTRACT, (_, codeId) => store.deleteContract(codeId));

  ipcMain.handle(REFRESH_CONTRACT_REFS, (e, path) => {
    console.log('e', e.senderFrame);
    const updRefs = getSmartContractData(path);
    const contracts = store.refreshContracts(updRefs, path);
    return contracts;
  });

  ipcMain.handle(IMPORT_SAVED_CONTRACTS, () => {
    let contracts = store.getContracts();
    if (!contracts.length) {
      const contractData = getSmartContractData();
      contracts = store.importContracts(contractData);
    }
    return contracts;
  });

  ipcMain.handle(IMPORT_NEW_CONTRACTS, async () => {
    const { filePaths } = await showSmartContractDialog();
    if (!filePaths.length) {
      return store.getContracts();
    }
    const [projectDir] = filePaths;
    const contractRefs = getSmartContractData(projectDir);
    const contracts = store.importContracts(contractRefs);
    contracts.forEach((contract) => {
      if (!contract.schemas) showMissingSchemaDialog();
    });
    return contracts;
  });
};
