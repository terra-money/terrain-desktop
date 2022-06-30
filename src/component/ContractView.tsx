import React from 'react';
import { SmartContract } from '../models/Contract';

type ContractType = {
    data: SmartContract
}

function ContractView(props: ContractType) {
    const { contractName, codeId, contractAddress, contractPath } = props.data;

    return (
        <>
            <ul className='divide-y divide-solid bg-white rounded-2xl m-2'>
                <li className='flex justify-between items-center'>
                    <div className='bg-blue-200 p-4 w-40 text-white rounded-l-2xl'>{contractName}</div>
                    <div className='p-4 w-90 overflow-auto'>{contractPath}</div>
                    <div className='p-4'>{codeId}</div>
                    <div className='p-4 whitespace-nowrap'>{contractAddress}</div>
                </li>
            </ul>
        </>
    );
}
export default React.memo(ContractView);