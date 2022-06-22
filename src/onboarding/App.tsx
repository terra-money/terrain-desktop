import React, { useState } from 'react';

function App() {
  const [isDockerInstalled, setIsDockerInstalled] = useState(false);

  const handleOnChange = ({ target }) => {
    setIsDockerInstalled(target.checked);
  };

  const handleLocalTerraInstalled = async () => {
    await (window as any).ipcRenderer.send('onboardComplete', true);
  }

  const handleLocalTerraNotInstalled = async () => {
    await (window as any).ipcRenderer.send('installLocalTerra', true);
  }

  return (
    <div className="flex items-center justify-center bg-terra-dark-blue h-screen">
      <div className="flex flex-col items-center block space-x-4">
        <div className="block h-40 w-40 mb-4">
          <img src="../src/assets/terraLogo.png" className="object-contain" alt="logo" />
        </div>
        <div className="flex-row text-white space-x-4">
          <label htmlFor="dockerInstalled">
            <input onChange={handleOnChange} id="dockerInstalled" type="checkbox" value="dockerInstalled" />
            I have Docker and Git installed
          </label>
        </div>
        {isDockerInstalled && (
          <>
           <button className="text-white hover:underline" type='button' onClick={handleLocalTerraInstalled}>I already have LocalTerra installed</button>
           <button className="text-white hover:underline" type='button' onClick={handleLocalTerraNotInstalled}>Install LocalTerra</button>
          </>
        )}
       
      </div>
    </div>
  );
}

export default App;
