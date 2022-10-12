import React, { useEffect, useState, memo } from 'react';
import { BsArrowLeftShort, BsSearch, BsCircleFill } from 'react-icons/bs';
import { ipcRenderer } from 'electron';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '@material-ui/core';
import { useTour } from '@reactour/tour';
import { NavLink, SettingsModal } from './components';
import { GET_LOCAL_TERRA_STATUS, TOGGLE_LOCAL_TERRA } from './constants';
import {
  useTerraBlockUpdate, useGetLatestHeight, useLocalTerraPathConfigured, useLocalTerraStarted,
} from './hooks/terra';
import { parseSearchUrl } from './utils';
import { ReactComponent as TerraLogo } from './assets/terra-logo.svg';
import useAppRoutes from './hooks/routes';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState(<></>);
  const navigate = useNavigate();
  const { terra } = useTerraBlockUpdate();
  const latestHeight = useGetLatestHeight();
  const isLocalTerraPathConfigured = useLocalTerraPathConfigured();
  const hasStartedLocalTerra = useLocalTerraStarted();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { setIsOpen: setTourIsOpen, currentStep, steps } = useTour();
  const { state: navState }: any = useLocation();

  useEffect(() => {
    if (navState && navState.firstOpen) {
      setTourIsOpen(true);
      toggleLocalTerra();
    }
  }, [navState]);

  useEffect(() => {
    const { page } = steps[currentStep] as any;
    if (page) navigate(page);
  }, [currentStep]);

  useEffect(() => {
    ipcRenderer.send(GET_LOCAL_TERRA_STATUS);
    if (!isLocalTerraPathConfigured.get()) navigate('/onboard');
    else navigate('/');
  }, []);

  useEffect(() => {
    if (hasStartedLocalTerra.get() === null) setIsLoading(true);
    else setIsLoading(false);
  }, [hasStartedLocalTerra, latestHeight]);

  const handleToggleOpen = (modalName: any) => {
    setModalComponent(modalName);
    setIsModalOpen(true);
  };

  const handleToggleClose = () => setIsModalOpen(false);
  const handleSearchInput = (e: any) => setSearchQuery(e.target.value);

  const handleSearch = (e: any) => {
    if (e.key === 'Enter') {
      const url = parseSearchUrl(searchQuery);
      window.open(url, '_blank');
    }
  };

  const toggleLocalTerra = async () => {
    if (isLoading) return;
    setIsLoading(true);
    ipcRenderer.invoke(TOGGLE_LOCAL_TERRA, !hasStartedLocalTerra.get());
    hasStartedLocalTerra.set(null); // We're not started or stopped.
  };

  const { routes, menu } = useAppRoutes({
    handleToggleClose,
    handleToggleOpen,
  });

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex">
        <div
          className={`left-nav bg-terra-dark-blue h-screen p-5 pt-7 ${
            open ? 'w-72' : 'w-20'
          } duration-300 relative`}
        >
          <BsArrowLeftShort
            className={`bg-white text-terra-dark-blue text-3xl rounded-full absolute -right-4 top-8 border border-terra-dark-blue cursor-pointer z-50 ${
              !open && 'rotate-180'
            }`}
            onClick={() => setOpen(!open)}
          />
          <div className="inline-flex items-center">
            <div className="w-10 aspect-square mr-2">
              <TerraLogo
                className={`object-contain cursor-pointer block duration-500 ${
                  open && 'rotate-[360deg]'
                }`}
              />
            </div>
            <h1
              className={`text-white origin-left font-medium text-2xl ${
                !open && 'scale-0'
              }`}
            >
              Terrarium
            </h1>
          </div>
          <div
            className={`tour__search flex items-center rounded-md mt-6 bg-light-white py-2 ${
              !open ? 'px-2.5' : 'px-4'
            }`}
          >
            <BsSearch
              onClick={() => setOpen(true)}
              className={`text-white text-lg block cursor-pointer ${
                open && 'mr-2 float-left'
              }`}
            />
            <input
              onChange={handleSearchInput}
              onKeyDown={handleSearch}
              type="search"
              placeholder="hash, height, documentation..."
              className={`text-base bg-transparent w-full text-white focus:outline-none duration-300 ${
                !open && 'hidden'
              }`}
            />
          </div>
          <ul className={`py-2 mt-2 ${open ? '' : ''}`}>
            {menu.map((menuItem, index) => {
              if (menuItem.name === 'Settings') {
                return (
                  <button
                    key={menuItem.name}
                    type="button"
                    onClick={() => handleToggleOpen(
                      <SettingsModal handleToggleClose={handleToggleClose} />,
                    )}
                    className={`flex ${menuItem.name}
                      ${open ? 'px-3' : 'justify-center'}
                      px-8 h-16 absolute bottom-0 left-0 w-full rounded-none space-x-1 items-center rounded-md mt-2 text-blue-200
                      `}
                  >
                    <div className={`float-left h-15 w-15 ${open ? 'mr-2' : 'block'}`}>
                      {menuItem.icon}
                    </div>
                    <div
                      className={`text-white text-base font-medium items-center cursor-pointer ${
                        !open && 'hidden'
                      }`}
                    >
                      <p>{menuItem.name}</p>
                    </div>
                  </button>
                );
              }
              return (
                <NavLink
                  key={menuItem.name}
                  to={menuItem.path}
                  className={`${menuItem.name}
                ${open ? 'px-3' : 'justify-center'}
                ${
                  index === menu.length - 1
                    ? 'px-8 h-16 absolute bottom-0 left-0 w-full rounded-none'
                    : 'h-12'
                }
                `}
                >
                  <div className={`float-left ${open ? 'mr-2' : 'block'}`}>
                    {menuItem.icon}
                  </div>
                  <div
                    className={`text-base font-medium flex-1 items-center cursor-pointer ${
                      !open && 'hidden'
                    }`}
                  >
                    <p>{menuItem.name}</p>
                  </div>
                </NavLink>
              );
            })}
          </ul>
        </div>

        <div className="relative flex-auto bg-gray-background w-full h-screen overflow-hidden">
          <header className="absolute w-full bg-white shadow-md z-40 flex justify-between p-6 lg:pl-12">
            <ul className="flex flex-row w-full gap-1 lg:gap-10 xl:gap-20 items-center font-medium">
              <li className="tour__current-block flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
                <p className="text-md md:text-[15px] md:leading-7 lg:text-xl xl:text-2xl text-terra-mid-blue">
                  {latestHeight}
                </p>
                <p className="md:text-md">Current Block</p>
              </li>
              <li className="flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
                <p className="text-md md:text-[15px] md:leading-7 lg:text-xl xl:text-2xl text-terra-mid-blue">
                  {terra.config.chainID}
                </p>
                <p className="md:text-md">Network ID</p>
              </li>
              <li className="flex-col px-2 font-bold text-xs text-terra-dark-blue whitespace-nowrap">
                <p className="text-md md:text-[15px] md:leading-7 lg:text-xl xl:text-2xl text-terra-mid-blue">
                  {terra.config.URL}
                </p>
                <p className="md:text-md">RPC Server</p>
              </li>
              <li className="ml-auto">
                <button
                  type="button"
                  onClick={toggleLocalTerra}
                  className={`${isLoading ? 'cursor-pointer' : ''}
                  tour__toggle-terra flex items-center justify-center space-x-3 text-xs rounded-lg w-28 md:w-40 h-10 border-4 border-gray-brackground`}
                >
                  <BsCircleFill
                    className={
                      isLoading
                        ? 'text-is-loading-yellow'
                        : hasStartedLocalTerra.get()
                          ? 'text-is-connected-green'
                          : 'text-not-connected-red'
                    }
                  />
                  <p className="text-terra-dark-blue text-md lg:text-lg font-bold">
                    LocalTerra
                  </p>
                </button>
              </li>
            </ul>
          </header>
          <main className="flex w-full h-full overflow-hidden pt-[88px] md:pt-[92px] xl:pt-[96px]">
            {routes}
          </main>
        </div>
        <Modal
          open={isModalOpen}
          onClose={handleToggleClose}
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {isModalOpen ? modalComponent : <></>}
        </Modal>
      </div>
    </div>
  );
};

export default memo(App);
