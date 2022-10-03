const { ipcMain } = require('../utils/ipcMain');
const { getSmartContractData } = require('../utils/contracts');
const { store } = require('../utils/store');
const { validateIpcSender } = require('../utils/misc');
const { showSmartContractDialog, showMissingSchemaDialog } = require('../utils/messages');

const {
  DELETE_ALL_CONTRACTS, IMPORT_NEW_CONTRACTS, IMPORT_SAVED_CONTRACTS, DELETE_CONTRACT, REFRESH_CONTRACT_REFS,
} = require('../../src/constants');

module.exports = () => {
  ipcMain.secureHandle(DELETE_ALL_CONTRACTS, () => store.deleteAllContracts());

  ipcMain.secureHandle(DELETE_CONTRACT, (_, codeId) => store.deleteContract(codeId));

  ipcMain.secureHandle(REFRESH_CONTRACT_REFS, (e, path) => {
    const updRefs = getSmartContractData(path);
    const contracts = store.refreshContracts(updRefs, path);
    return contracts;
  });

  ipcMain.secureHandle(IMPORT_SAVED_CONTRACTS, () => {
    let contracts = store.getContracts();
    if (!contracts.length) {
      const contractData = getSmartContractData();
      contracts = store.importContracts(contractData);
    }
    return contracts;
  });

  ipcMain.secureHandle(IMPORT_NEW_CONTRACTS, async () => {
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
