 interface SmartContract {
    name: string
    path: string;
    address: string;
    codeId: number;
}
export type ContractData = {
    data: SmartContract
}
