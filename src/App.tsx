import { Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { BsArrowLeftShort, BsSearch, BsCircleFill } from 'react-icons/bs';
import logo from './assets/terraLogo.png';
import { NavLink } from './component';
import { useTerra, useGetBlocks } from './package/hooks';
import {
  TransactionPage, LogsPage, AccountsPage, BlockPage,
} from './pages';

const menu = [
  {
    name: 'Accounts',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="w-6 aspect-square py-2 bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
      </svg>
    ),
    url: '/',
  },
  {
    name: 'Blocks',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="w-6 aspect-square py-2  bi bi-grid" viewBox="0 0 16 16">
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
      </svg>
    ),
    url: '/blocks',
  },
  {
    name: 'Transactions',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="w-6 aspect-square py-2  bi bi-arrow-left-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z" />
      </svg>
    ),
    url: '/transactions',
  },
  {
    name: 'Contracts',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="w-6 aspect-square py-2  bi bi-broadcast" viewBox="0 0 16 16">
        <path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707zm2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708zm5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708zm2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
      </svg>
    ),
    url: '/contracts',
  },
  {
    name: 'Events',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="w-6 aspect-square py-2  bi bi-clock-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
      </svg>
    ),
    url: '/events',
  },
  {
    name: 'Logs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="w-6 aspect-square py-2  bi bi-terminal" viewBox="0 0 16 16">
        <path d="M6 9a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 9zM3.854 4.146a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2z" />
        <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12z" />
      </svg>
    ),
    url: '/logs',
  },
];

function App() {
  const [open, setOpen] = useState(true);
  const [localTerraActive, setLocalTerraActive] = useState(false);
  const { terra, getLocalTerraStatus } = useTerra();
  const { latestHeight } = useGetBlocks();

  useEffect(() => {
    setLocalTerraActive(getLocalTerraStatus());
  }, [latestHeight]);

  const toggleLocalTerra = async () => {
    await window.ipcRenderer.send('LocalTerra', !localTerraActive);
    setLocalTerraActive(!localTerraActive); // could experiment with polling here
  };

  return (
    <div className="flex">
      <div className={`bg-terra-dark-blue h-screen p-5 pt-8 ${open ? 'w-72' : 'w-20'} duration-300 relative`}>
        <BsArrowLeftShort className={`bg-white text-terra-dark-blue text-3xl rounded-full absolute -right-4 top-9 border border-terra-dark-blue cursor-pointer ${!open && 'rotate-180'}`} onClick={() => setOpen(!open)} />
        <div className="inline-flex items-center">
          <div className="w-10 aspect-square mr-2">
            <img src={logo} className={`object-contain cursor-pointer block duration-500 ${open && 'rotate-[360deg]'}`} alt="logo" />
          </div>
          <h1 className={`text-white origin-left font-medium text-2xl ${!open && 'scale-0'}`}>Terrarium</h1>
        </div>
        <div className={`flex items-center rounded-md mt-6 bg-light-white py-2 ${!open ? 'px-2.5' : 'px-4'}`}>
          <BsSearch className={`text-white text-lg block cursor-pointer ${open && 'mr-2 float-left'}`} />
          <input type="search" placeholder="Search" className={`text-base bg-transparent w-full text-white focus:outline-none duration-300 ${!open && 'hidden'}`} />
        </div>
        <ul className={`py-2 mt-2 ${open ? 'px-3' : 'px-2.5 mr-2'}`}>
          {menu.map((m) => (
            <NavLink
              key={m.name}
              to={m.url}
            >
              <div className="mr-2 block float-left">
                {m.icon}
              </div>
              <div className={`text-white text-base font-medium flex-1 items-center cursor-pointer ${!open && 'hidden'}`}>
                <p>{m.name}</p>
              </div>
            </NavLink>
          ))}
        </ul>
      </div>

      <div className="flex-auto bg-gray-background">

        <header className="p-4 bg-white">
          <ul className="flex flex-row justify-between items-center font-medium">
            <li className="flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
              <p className="text-center uppercase">Current Block</p>
              <p className="text-center text-terra-mid-blue">{latestHeight}</p>
            </li>
            <li className="flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
              <p className="text-center uppercase">Gas Price</p>
              <p className="text-center text-terra-mid-blue">20000000</p>
            </li>
            <li className="flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
              <p className="text-center uppercase">Gas Limit</p>
              <p className="text-center text-terra-mid-blue">0</p>
            </li>
            <li className="flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
              <p className="text-center uppercase">Hardfork</p>
              <p className="text-center text-terra-mid-blue">0</p>
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
              <button type="button" onClick={toggleLocalTerra} className="flex items-center justify-center space-x-3 text-xs rounded-lg w-40 h-10 border-4 border-gray-brackground">
                <BsCircleFill className={localTerraActive ? 'text-is-connected-green' : 'text-not-connected-red'} />
                <p className="text-terra-dark-blue text-lg font-bold">LocalTerra</p>
              </button>
            </li>
          </ul>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<AccountsPage />} />
            <Route path="/blocks" element={<BlockPage />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Routes>
        </main>

      </div>

    </div>
  );
}

export default App;
