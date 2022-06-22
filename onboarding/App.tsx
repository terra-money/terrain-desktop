import React, { useState } from 'react';

function App() {
  const [isDockerInstalled, setIsDockerInstalled] = useState(false);

  const handleOnChange = () => {
    setIsDockerInstalled(!isDockerInstalled);
  };

  const handleLocalTerraInstalled = async () => {
    await (window as any).ipcRenderer.send('OnboardComplete', true);
  }

  const handleLocalTerraNotInstalled = () => {
    console.log('local terra not installed clicked');
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
            I have Docker Installed
          </label>
        </div>
        <button className={`${isDockerInstalled ? 'text-white' : 'hidden'} hover:underline`} type='button' onClick={handleLocalTerraInstalled}>I have LocalTerra Installed.</button>
        <button className={`${isDockerInstalled ? 'text-white' : 'hidden'} hover:underline`} type='button' onClick={handleLocalTerraNotInstalled}>I do not have LocalTerra Installed.</button>

      </div>
    </div>
  );
}

export default App;
