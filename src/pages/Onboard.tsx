import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as TerraLogo } from '../assets/terra-logo.svg';

export default function Onboard() {
  const navigate = useNavigate();
  const [isDockerInstalled, setIsDockerInstalled] = useState(false);

  const handleOnChange = (e: any) => {
    setIsDockerInstalled(e.target.checked);
  };

  const handleSelectLocalTerraPath = async () => {
    await ipcRenderer.invoke('SelectLocalTerraPath');
    navigate("/accounts");
  }

  const handleLocalTerraNotInstalled = async () => {
    await ipcRenderer.invoke('InstallLocalTerra');
    navigate("/accounts");
  }

  return (
    <div className="flex items-center justify-center bg-terra-dark-blue h-screen"
      style={{"position": "fixed", "top": "0", "right": "0", "bottom": "0", "left": "0", "zIndex": "10000"}}>
      <div className="flex flex-col items-center block space-x-4">
        <div className="block h-40 w-40 mb-4">
          <TerraLogo/>
        </div>
        <div className="flex-row text-white space-x-4">
          <label htmlFor="dockerInstalled">
            <input onChange={handleOnChange} id="dockerInstalled" type="checkbox" value="dockerInstalled" />
            I have Docker and Git installed
          </label>
        </div>
        {isDockerInstalled && (
          <>
           <button className="text-white hover:underline" type='button' onClick={handleSelectLocalTerraPath}>I already have LocalTerra installed</button>
           <button className="text-white hover:underline" type='button' onClick={handleLocalTerraNotInstalled}>Install LocalTerra</button>
          </>
        )}
      </div>
    </div>
  );
}