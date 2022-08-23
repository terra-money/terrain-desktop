import React from 'react';

function KeyViewModal({
  mnemonic,
  handleClose,
}: {
  mnemonic: string;
  handleClose: any;
}) {
  return (
    <div className="absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4">
      <div className="bg-white px-12 py-10 rounded-md max-w-lg text-center">
        <h1
          id="modal-title"
          className="text-2xl mb-10 font-bold text-slate-500"
        >
          Account Mnemonic
        </h1>
        <h4
          id="modal-description"
          className="leading-7 bg-gray-200 rounded-xl shadow-inner p-4"
        >
          {mnemonic}
        </h4>
        <button
          type="button"
          onClick={handleClose}
          className="bg-blue-500 px-4 py-2 mt-10 rounded-md text-md text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default React.memo(KeyViewModal);
