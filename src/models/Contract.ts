export interface SmartContract {
    name: string
    path: string;
    address: string;
    codeId: number;
    schemas: any[] | null;
}
export type ContractViewProps = {
    data: SmartContract
    walletName: string
    handleDeleteContract: Function
    handleQuery: Function
    handleExecute: Function
    handleRefreshRefs: Function
}
