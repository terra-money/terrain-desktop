import React from 'react';
import { ContractData } from '../models/Contract';

function ContractView(props: ContractData) {
    const { name, codeId, address, path } = props.data;
    return (
    <ul className='divide-y divide-solid bg-white rounded-2xl m-2'>
        <li className='flex justify-between items-center'>
            <div className='bg-blue-200 p-4 w-40 text-white rounded-l-2xl'>{name}</div>
            <div className='p-4 w-90 overflow-auto'>{path}</div>
            <div className='p-4'>{codeId}</div>
            <div className='p-4 whitespace-nowrap'>{address}</div>
        </li>
    </ul>
    );
}
export default React.memo(ContractView);