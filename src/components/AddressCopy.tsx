import React from 'react';

const AddressCopy = ({ address }: { address: string }) => {
  console.log('address', address);

  return (
    <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
      <div className="bg-white px-16 py-14 rounded-md max-w-sm text-center">
        <h1 className="text-xl mb-4 font-bold text-slate-500">Account Mnemonic</h1>
        <h4>{address}</h4>
      </div>
    </div>
  );
};

export default React.memo(AddressCopy);
