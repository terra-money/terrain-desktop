const { ipcMain } = require('electron');
const { getSmartContractData } = require('../utils/localTerra');
const { store } = require('../store');
const { showSmartContractDialog } = require('../utils/messages');

const {
  DELETE_CONTRACT_REFS, IMPORT_NEW_CONTRACTS, IMPORT_SAVED_CONTRACTS,
} = require('../../src/constants');

module.exports = () => {
  ipcMain.handle(DELETE_CONTRACT_REFS, () => store.deleteAllContracts());

  ipcMain.handle(IMPORT_SAVED_CONTRACTS, () => {
    let contracts = store.getContracts();
    if (!contracts.length) {
      const contractData = getSmartContractData();
      contracts = store.importContracts(contractData);
    }
    return contracts;
  });

  ipcMain.handle(IMPORT_NEW_CONTRACTS, () => {
    const { filePaths } = showSmartContractDialog();
    if (!filePaths.length) {
      return store.getContracts();
    }
    const [projectDir] = filePaths;
    const contractRefs = getSmartContractData(projectDir);
    const contracts = store.importContracts(contractRefs);
    return contracts;
  });
};
