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
import { ReactComponent as CogIcon } from '../assets/icons/menu/cog.svg';

const useNav = ({
  handleToggleClose,
  handleToggleOpen,
}: {
  handleToggleClose: Function;
  handleToggleOpen: Function;
}) => {
  const menu = [
    {
      name: 'Contracts',
      icon: <ContractsIcon />,
      path: '/',
      element: <ContractsPage />,
    },
    {
      name: 'Accounts',
      icon: <AccountsIcon />,
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
      icon: <BlocksIcon />,
      path: '/blocks',
      element: <BlockPage />,
    },
    {
      name: 'Transactions',
      icon: <TransactionsIcon />,
      path: '/transactions',
      element: <TransactionsPage />,
    },

    {
      name: 'Logs',
      icon: <LogsIcon />,
      path: '/logs',
      element: <LogsPage />,
    },
    {
      name: 'Settings',
      icon: <CogIcon />,
      path: '/settings',
    },
  ];

  const routes = [
    {
      name: 'Onboard',
      path: '/onboard',
      element: <OnboardPage />,
    },
    // Add here routes that cannot be accessed directly from the menu entry

    // Menu entries
    ...menu,
  ];

  return {
    menu,
    routes: useRoutes(routes),
  };
};

export default useNav;
