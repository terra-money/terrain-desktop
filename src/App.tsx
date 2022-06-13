import { Routes, Route } from 'react-router-dom';
import React from 'react';
import NavLink from './component/NavLink';
import AccountsPage from './pages/Account';
import BlockPage from './pages/Block';
import { useTerra, useGetBlocks } from './package';
import TransactionPage from './pages/Transaction';

const menu = [
  {
    name: 'Accounts',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    url: '/',
  },
  {
    name: 'Blocks',

    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    url: '/blocks',
  },
  {
    name: 'Transactions',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),

    url: '/transactions',
  },

  {
    name: 'Contracts',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
        />
      </svg>
    ),
    url: '/contracts',
  },

  {
    name: 'Events',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),

    url: '/events',
  },

  {
    name: 'Logs',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    url: '/logs',
  },
];
function App() {
  const { terra } = useTerra();
  const { latestHeight } = useGetBlocks();
  return (
    <>
      <nav className="bg-blue-800 px-6 py-2 flex justify-between items-center">
        <ul className="flex items-center space-x-3">
          {menu.map((m) => (
            <NavLink key={m.name} to={m.url}>
              {m.icon}
              <p className="text-xl">{m.name}</p>
            </NavLink>
          ))}
        </ul>

        <div className="w-1/4">
          <input
            placeholder="Search Tx Hashes, block numbers"
            className="rounded-full w-full text-sm text-blue-100 bg-transparent border px-2 py-2 border-blue-100"
          />
        </div>
      </nav>
      <section className="bg-blue-900 px-6 py-2 flex justify-between items-center">
        <ul className="flex items-center space-x-3">
          <li className="text-xs font-bold">
            <p className="uppercase text-blue-200 m-0">current block</p>
            <p className="text-blue-400 m-0">{latestHeight}</p>
          </li>
          <li className="text-xs font-bold">
            <p className="uppercase text-blue-200 m-0">gas price</p>
            <p className="text-blue-400 m-0">20000000</p>
          </li>
          <li className="text-xs font-bold">
            <p className="uppercase text-blue-200 m-0">gas limit</p>
            <p className="text-blue-400 m-0">0</p>
          </li>
          <li className="text-xs font-bold">
            <p className="uppercase text-blue-200 m-0">hardfork</p>
            <p className="text-blue-400 m-0">0</p>
          </li>
          <li className="text-xs font-bold">
            <p className="uppercase text-blue-200 m-0">Network Id</p>
            <p className="text-blue-400 m-0">{terra.config.chainID}</p>
          </li>
          <li className="text-xs font-bold">
            <p className="uppercase text-blue-200 m-0">RPC Server</p>
            <p className="text-blue-400 m-0">{terra.config.URL}</p>
          </li>
        </ul>
      </section>
      <main className="min-h-screen bg-blue-100">
        <Routes>
          <Route path="/" element={<AccountsPage />} />
          <Route path="/blocks" element={<BlockPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
