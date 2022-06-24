import React from 'react';
import { useRoutes } from 'react-router-dom';
import {
  TransactionsPage,
  LogsPage,
  BlockPage,
  ContractsPage,
  EventsPage,
  OnboardPage,
  AccountsPage,
  LoadingPage
} from '../../pages';
import { ReactComponent as AccountsIcon } from '../../assets/icons/menu/accounts.svg';
import { ReactComponent as BlocksIcon } from '../../assets/icons/menu/blocks.svg';
import { ReactComponent as TransactionsIcon } from '../../assets/icons/menu/transactions.svg';
import { ReactComponent as ContractsIcon } from '../../assets/icons/menu/contracts.svg';
import { ReactComponent as EventsIcon } from '../../assets/icons/menu/events.svg';
import { ReactComponent as LogsIcon } from '../../assets/icons/menu/logs.svg';

const useNav = () => {
  const menu = [
    {
      name: 'Accounts',
      icon: <AccountsIcon />,
      path: '/accounts',
      element: <AccountsPage />,
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
      name: 'Contracts',
      icon: <ContractsIcon />,
      path: '/contracts',
      element: <ContractsPage />,
    },
    {
      name: 'Events',
      icon: <EventsIcon />,
      path: '/events',
      element: <EventsPage />,
    },
    {
      name: 'Logs',
      icon: <LogsIcon />,
      path: '/logs',
      element: <LogsPage />,
    },
  ];

  const routes = [
    {
      name: 'Onboard',
      path: '/onboard',
      element: <OnboardPage />,
    },
    {
      name: 'Loading',
      path: '/',
      element: <LoadingPage />,
    },
    // Add here routes that cannot be accessed directly from the menu entry

    // Menu entries
    ...menu,
  ];

  return {
    menu,
    element: useRoutes(routes),
  };
};

export default useNav;
