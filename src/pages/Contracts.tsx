import React from 'react';

import { ContractView } from '../component';

export default function ContractsPage() {



  return (
    <div className='w-full flex-col bg-red'>

      <button type='button' className=' p-30 rounded-lg text-white bg-terra-dark-blue'>Add Contract</button>
      <ContractView />
    </div>
  );
}
