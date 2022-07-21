import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as TerraLogo } from '../assets/terra-logo.svg';

export default function Onboard() {
  const [isDockerInstalled, setIsDockerInstalled] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e: any) => {
    setIsDockerInstalled(e.target.checked);
  };

  const onSetLocalTerraPath = async () => {
    try {
      await ipcRenderer.invoke('SetLocalTerraPath');
      navigate('/');
    } catch (e: any) {
      console.log(e);
      // TODO: Display error message on interface (incorrect path)
    }
  };

  const onLocalTerraInstall = async () => {
    try {
      await ipcRenderer.invoke('InstallLocalTerra');
      navigate('/');
    } catch (e: any) {
      console.log(e);
      // TODO: Display error message on interface
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-terra-dark-blue h-screen"
      style={{
        position: 'fixed', top: '0', right: '0', bottom: '0', left: '0', zIndex: '10000',
      }}
    >
      <div className="flex flex-col items-center block space-x-4">
        <div className="block h-40 w-40 mb-4">
          <TerraLogo />
        </div>
        <div className="flex-row text-white space-x-4">
          <label htmlFor="dockerInstalled">
            <input onChange={handleOnChange} id="dockerInstalled" type="checkbox" value="dockerInstalled" />
            I have Docker and Git installed
          </label>
        </div>
        {isDockerInstalled && (
          <>
            <button className="text-white hover:underline" type="button" onClick={onSetLocalTerraPath}>I already have LocalTerra installed</button>
            <button className="text-white hover:underline" type="button" onClick={onLocalTerraInstall}>Install LocalTerra</button>
          </>
        )}
      </div>
    </div>
  );
}
