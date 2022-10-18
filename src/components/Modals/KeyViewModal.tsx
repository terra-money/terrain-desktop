import React from 'react';
import { ReactComponent as Close } from '../../assets/icons/close.svg';

function KeyViewModal({
  mnemonic,
  handleClose,
}: {
  mnemonic: string;
  handleClose: any;
}) {
  return (
    <div className="absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4">
      <div className="bg-white p-7 rounded-lg max-w-xl text-center">
        <div className="flex justify-between items-center pb-7">
          <h3 className="text-lg font-medium text-terra-text">
            Account Mnemonic
          </h3>
          <button type="button" className="ml-auto">
            <Close
              onClick={handleClose}
              className="w-6 h-6 fill-terra-text hover:fill-terra-navy"
            />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <h4
          id="modal-description"
          className="leading-7 bg-terra-background-gray text-terra-text text-left rounded-lg p-4"
        >
          {mnemonic}
        </h4>
      </div>
    </div>
  );
}

export default React.memo(KeyViewModal);
