import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { ContractView } from '../component';

const CONTRACTS_HEADER = [{
  title: "Contract Name",
  className: "w-40 p-4"
}, {
  title: "Path",
  className: "w-90 p-4"
}, {
  title: "Code ID",
  className: "p-4"
}, {
  title: "Contract Address",
  className: "p-4"
}];


export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);

  async function handleRefsImport() {
    const res = await ipcRenderer.invoke('ImportContractRefs');
    setContracts(res);
  };

  async function importAllContracts() {
    const allContracts = await ipcRenderer.invoke('AllContracts');
    setContracts(allContracts);
  };

  useEffect(() => {
    importAllContracts();
  }, []);

  return (
    <div className='flex flex-col w-full '>
      <button type='button' onClick={handleRefsImport} className='h-10 my-3 mx-2 px-5 rounded-lg text-white bg-terra-dark-blue inset-y-0 right-0'>Add Contract</button>
      <div className='bg-gray-background flex justify-between'>
        {CONTRACTS_HEADER.map((header, index) => (
          <div key={index} className={header.className}>{header.title}</div>
        ))}
      </div>
      <div className='bg-white rounded-lg' />
      <Virtuoso followOutput
        className="flex flex-col w-full"
        data={contracts}
        itemContent={(index, data) => <ContractView data={data} key={index} />} />
    </div>
  );
}
