 interface SmartContract {
    name: string
    path: string;
    address: string;
    codeId: number;
    schemas: any[] | null;
}
export type ContractData = {
    data: SmartContract
}
