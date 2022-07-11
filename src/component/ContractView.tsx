import React from 'react';
import { ContractData } from '../models/Contract';
import { ReactComponent as ExternalLinkIcon } from '../assets/icons/external-link.svg';
import { REACT_APP_FINDER_URL } from '../constants'


function ContractView(props: ContractData) {
    const { name, codeId, address, path } = props.data;
    const contractHref = `${REACT_APP_FINDER_URL}/address/${address}`;

    return (
        <ul className='divide-y divide-solid bg-white rounded-2xl m-2'>
            <li className='flex justify-between items-center'>
                <div className='bg-blue-200 p-4 py-8 rounded-tl-lg rounded-bl-lg text-white'>
                    <a className="flex items-center	text-blue-800" target="_blank" href={contractHref} rel="noreferrer">
                        <div className='mr-2'>{name}</div>
                        <ExternalLinkIcon />
                    </a></div>
                <div className='p-4 w-90 overflow-auto'>{path}</div>
                <div className='p-4'>{codeId}</div>
                <div className='p-4 whitespace-nowrap'>{address}</div>
            </li>
        </ul>
    );
}
export default React.memo(ContractView);