import React from 'react';

function KeyView({ mnemonic, handleClose }: { mnemonic: string, handleClose: any }) {
  return (
    <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
      <div className="bg-white px-16 py-14 rounded-md max-w-sm text-center">
        <h1 className="text-xl mb-4 font-bold text-slate-500">Account Mnemonic</h1>
        <h4>{mnemonic}</h4>
        <button type="button" onClick={handleClose} className="bg-blue-500 px-4 py-2 rounded-md text-md text-white">Close</button>
      </div>
    </div>
  );
}

export default React.memo(KeyView);
