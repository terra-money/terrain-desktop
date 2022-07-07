const Store = require('electron-store');
const fs = require('fs');

class TerrariumStore extends Store {
    constructor(settings) {
        super(settings)

        this.contracts = this.get('contracts') || []
    }

    saveContracts() {
        this.set('contracts', this.contracts)
        return this
    }

    getContracts() {
        this.contracts = this.get('contracts') || []
        this.checkIfContractExists(this.contracts);
        return this
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

    deleteAllContracts() {
        this.contracts = [];
        return this.saveContracts;
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