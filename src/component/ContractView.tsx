import React from 'react';

function ContractFolderView() {

    return (
        <div className="w-full text-right flex">

            <div className="w-11/12 flex justify-between px-4">
                <div>
                    <p>Name</p>
                    <p>name placeholder</p>
                </div>
                <div>
                    <p>Address</p>
                    <p>address placeholder</p>
                </div>
                <div>
                    <p>Tx Count</p>
                    <p>tx count placeholder</p>
                </div>
                <div>
                    <p>Status</p>
                    <p>status placeholder</p>
                </div>
            </div>

        </div>
    );
}
export default React.memo(ContractFolderView);