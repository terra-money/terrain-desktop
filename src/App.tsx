import React, { useEffect, useState, memo } from 'react';
import { BsArrowLeftShort, BsSearch, BsCircleFill } from 'react-icons/bs';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import { NavLink } from './components';
import {
  useTerra, useGetLatestHeight, useLocalTerraPathConfigured, useLocalTerraStarted,
} from './package/hooks';
import { parseSearchUrl } from './utils';
import logo from './assets/terra-logo.svg';
import useNav from './package/hooks/routes';

function App() {
  const { element: routes, menu } = useNav();
  const navigate = useNavigate();
  const { terra } = useTerra();
  const latestHeight = useGetLatestHeight();
  const isLocalTerraPathConfigured = useLocalTerraPathConfigured();
  const hasStartedLocalTerra = useLocalTerraStarted();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLocalTerraPathConfigured) navigate('/onboard');
    else navigate('/');
  }, [isLocalTerraPathConfigured]);

  useEffect(() => {
    if (latestHeight) setIsLoading(false);
    else if (hasStartedLocalTerra === null && !latestHeight) setIsLoading(true);
  }, [hasStartedLocalTerra, latestHeight]);

  const handleSearchInput = (e: any) => setSearchQuery(e.target.value);

  const handleSearch = (e: any) => {
    if (e.key === 'Enter') {
      const url = parseSearchUrl(searchQuery);
      window.open(url, '_blank');
    }
  };

  const toggleLocalTerra = async () => {
    setIsLoading(true);
    await ipcRenderer.invoke('ToggleLocalTerraStatus', !hasStartedLocalTerra);
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex">
        <div className={`bg-terra-dark-blue h-full p-5 pt-8 ${open ? 'w-72' : 'w-20'} duration-300 relative`}>
          <BsArrowLeftShort
            className={`bg-white text-terra-dark-blue text-3xl rounded-full absolute -right-4 top-9 border border-terra-dark-blue cursor-pointer ${!open && 'rotate-180'}`}
            onClick={() => setOpen(!open)}
          />
          <div className="inline-flex items-center">
            <div className="w-10 aspect-square mr-2">
              <img src={logo} className={`object-contain cursor-pointer block duration-500 ${open && 'rotate-[360deg]'}`} alt="logo" />
            </div>
            <h1 className={`text-white origin-left font-medium text-2xl ${!open && 'scale-0'}`}>Terrarium</h1>
          </div>
          <div className={`flex items-center rounded-md mt-6 bg-light-white py-2 ${!open ? 'px-2.5' : 'px-4'}`}>
            <BsSearch className={`text-white text-lg block cursor-pointer ${open && 'mr-2 float-left'}`} />
            <input
              onChange={handleSearchInput}
              onKeyDown={handleSearch}
              type="search"
              placeholder="Search"
              className={`text-base bg-transparent w-full text-white focus:outline-none duration-300 ${!open && 'hidden'}`}
            />
          </div>
          <ul className={`py-2 mt-2 ${open ? 'px-3' : 'px-2.5 mr-2'}`}>
            {menu.map((menuItem) => (
              <NavLink key={menuItem.name} to={menuItem.path}>
                <div className="mr-2 block float-left">
                  {menuItem.icon}
                </div>
                <div className={`text-white text-base font-medium flex-1 items-center cursor-pointer ${!open && 'hidden'}`}>
                  <p>{menuItem.name}</p>
                </div>
              </NavLink>
            ))}
          </ul>
        </div>

        <div className="flex-auto bg-gray-background w-full h-screen overflow-auto">

          <header className="p-4 bg-white overflow-x-auto">
            <ul className="flex flex-row justify-between items-center font-medium">
              <li className="flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
                <p className="text-center uppercase">Current Block</p>
                <p className="text-center text-terra-mid-blue">{latestHeight}</p>
              </li>
              <li className="flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
                <p className="text-center uppercase">Network ID</p>
                <p className="text-center text-terra-mid-blue">{terra.config.chainID}</p>
              </li>
              <li className="flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
                <p className="text-center uppercase">RPC Server</p>
                <p className="text-center text-terra-mid-blue">{terra.config.URL}</p>
              </li>
              <li>
                <button
                  type="button"
                  onClick={toggleLocalTerra}
                  className="flex items-center justify-center space-x-3 text-xs rounded-lg w-40 h-10 border-4 border-gray-brackground"
                >
                  <BsCircleFill className={
                    isLoading ? 'animate-bounce text-is-loading-grey'
                      : hasStartedLocalTerra ? 'text-is-connected-green'
                        : 'text-not-connected-red'
                      }
                  />
                  <p className="text-terra-dark-blue text-lg font-bold">LocalTerra</p>
                </button>
              </li>
            </ul>
          </header>
          <main className="flex w-full h-[calc(100vh-72px)] overflow-auto">
            {routes}
          </main>
        </div>
      </div>
    </div>
  );
}

export default memo(App);
