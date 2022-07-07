const Store = require('electron-store');
const fs = require('fs');

class TerrariumStore extends Store {
    constructor() {
        super();
        this.contracts = this.get('contracts') || []
    }

    async saveContracts() {
        await this.set('contracts', this.contracts)
        return this.contracts
    }

    async getContracts() {
        this.contracts = await this.get('contracts')
        this.checkIfContractExists(this.contracts);
        return this.contracts
    }

    addContract(contractsArray) {
        if (contractsArray != null) {
            contractsArray.map(contract => {
                this.contracts = [...this.contracts, contract];
                return this.saveContracts()
            })
        }
    }

    deleteContract(contract) {
        this.contracts = this.contracts.filter(t => t !== contract)
        return this.saveContracts()
    }

    async deleteAllContracts() {
        this.contracts = [];
        await this.saveContracts();
    }

    checkIfContractExists(contractsArray) {
        contractsArray.map(contract => {
            if (!fs.existsSync(contract.path)) {
                this.deleteContract(contract);
            }
            return true;
        })
    }

}

module.exports = {
    TerrariumStore
}