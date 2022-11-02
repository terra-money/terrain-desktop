const Store = require('electron-store');
const fs = require('fs');
const {
  GET_BLOCKTIME,
  SET_BLOCKTIME,
  GET_OPEN_AT_LOGIN,
  SET_OPEN_AT_LOGIN,
} = require('../constants');

class TerrariumStore extends Store {
  constructor() {
    super();
    this.contracts = this.get('contracts') || [];
    this.localTerraPath = this.get('localTerraPath');
  }

  setLocalTerraPath(path) {
    return this.set('localTerraPath', path);
  }

  getLocalTerraPath() {
    return this.get('localTerraPath');
  }

  getBlocktime() {
    return window.ipcRenderer.invoke(GET_BLOCKTIME);
  }

  setBlocktime(newBlocktime) {
    return window.ipcRenderer.invoke(SET_BLOCKTIME, newBlocktime);
  }

  getOpenAtLogin() {
    return window.ipcRenderer.invoke(GET_OPEN_AT_LOGIN);
  }

  setOpenAtLogin(status) {
    return window.ipcRenderer.invoke(SET_OPEN_AT_LOGIN, status);
  }

  getLiteMode() {
    return this.get('liteMode') || true;
  }

  setLiteMode(status) {
    return this.set('liteMode', status);
  }

  setContracts() {
    this.set('contracts', this.contracts);
    return this.contracts;
  }

  getContracts() {
    this.contracts = this.get('contracts') || [];
    this.checkIfContractsExists(this.contracts);
    return this.contracts;
  }

  refreshContracts(updRefs, path) {
    this.contracts = this.contracts.filter(
      (contract) => contract.path !== path,
    );
    this.contracts = [...this.contracts, ...updRefs];
    return this.setContracts();
  }

  importContracts(contracts) {
    if (contracts) {
      this.contracts = [...this.contracts, ...contracts];
      return this.setContracts();
    }
  }

  deleteContract(codeId) {
    this.contracts = this.contracts.filter(
      (contract) => contract.codeId !== codeId,
    );
    return this.setContracts();
  }

  deleteAllContracts() {
    this.contracts = [];
    return this.setContracts();
  }

  checkIfContractsExists(contracts) {
    contracts.forEach((contract) => {
      if (!fs.existsSync(contract.path)) {
        this.deleteContract(contract);
      }
    });
  }
}
const store = new TerrariumStore();

module.exports = { store };
