import React from 'react';
import { useRoutes } from 'react-router-dom';
import {
  TransactionsPage,
  LogsPage,
  BlockPage,
  ContractsPage,
  OnboardPage,
  AccountsPage,
} from '../pages';
import { ReactComponent as AccountsIcon } from '../assets/icons/menu/accounts.svg';
import { ReactComponent as BlocksIcon } from '../assets/icons/menu/blocks.svg';
import { ReactComponent as TransactionsIcon } from '../assets/icons/menu/transactions.svg';
import { ReactComponent as ContractsIcon } from '../assets/icons/menu/contracts.svg';
import { ReactComponent as LogsIcon } from '../assets/icons/menu/logs.svg';
import { ReactComponent as SettingsIcon } from '../assets/icons/menu/settings.svg';

const useAppRoutes = ({
  handleToggleClose,
  handleToggleOpen,
}: {
  handleToggleClose: Function;
  handleToggleOpen: Function;
}) => {
  const menu = [
    {
      name: 'Contracts',
      icon: <ContractsIcon className="w-6 h-6" />,
      path: '/',
      element: <ContractsPage />,
    },
    {
      name: 'Accounts',
      icon: <AccountsIcon className="w-6 h-6" />,
      path: '/accounts',
      element: (
        <AccountsPage
          handleToggleClose={handleToggleClose}
          handleToggleOpen={handleToggleOpen}
        />
      ),
    },
    {
      name: 'Blocks',
      icon: <BlocksIcon className="w-6 h-6" />,
      path: '/blocks',
      element: <BlockPage />,
    },
    {
      name: 'Transactions',
      icon: <TransactionsIcon className="w-6 h-6" />,
      path: '/transactions',
      element: <TransactionsPage />,
    },
    {
      name: 'Logs',
      icon: <LogsIcon className="w-6 h-6" />,
      path: '/logs',
      element: <LogsPage />,
    },
    {
      name: 'Settings',
      icon: <SettingsIcon className="w-6 h-6" />,
      path: '/settings',
    },
  ];

  const routes = [
    {
      name: 'Onboard',
      path: '/onboard',
      element: <OnboardPage />,
    },
    // Add routes that cannot be accessed directly from the menu entry
    ...menu,
  ];

  return {
    menu,
    routes: useRoutes(routes),
  };
};

export default useAppRoutes;
