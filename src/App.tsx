import React, {
  useEffect, useState, memo, useCallback,
} from 'react';
import { BsArrowLeftShort, BsSearch, BsCircleFill } from 'react-icons/bs';
import { ipcRenderer } from 'electron';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '@material-ui/core';
import { useTour } from '@reactour/tour';
import { debounce } from 'lodash';
import { NavLink, SettingsModal } from './components';
import { GET_LOCAL_TERRA_STATUS, TOGGLE_LOCAL_TERRA, TOGGLE_DEBOUNCE_MS } from './constants';
import {
  useTerraBlockUpdate, useGetLatestHeight, useLocalTerraPathConfigured, useLocalTerraStarted,
} from './hooks/terra';
import { parseSearchUrl } from './utils';
import { ReactComponent as TerraLogo } from './assets/terra-logo.svg';
import TerrariumLettersImg from './assets/terrarium-letters-logo.png';
import useAppRoutes from './hooks/routes';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState<any>();
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

  const toggleLocalTerra = () => {
    setIsLoading(true);
    ipcRenderer.invoke(TOGGLE_LOCAL_TERRA, !hasStartedLocalTerra.get());
    hasStartedLocalTerra.set(null); // We're not started or stopped.
  };

  const debouncedToggleLocalTerra = useCallback(
    debounce(
      () => toggleLocalTerra(),
      TOGGLE_DEBOUNCE_MS,
      { leading: true, trailing: false, maxWait: TOGGLE_DEBOUNCE_MS },
    ),
    [],
  );

  const { routes, menu } = useAppRoutes({
    handleToggleClose,
    handleToggleOpen,
  });

  return (
    <div className="flex flex-col w-screen h-screen bg-terra-background-gray">
      <div className="flex">
        <div
          className={`left-nav bg-terra-navy h-screen p-5 pt-7 ${
            open ? 'w-72 min-w-[260px]' : 'w-20 min-w-20'
          } duration-300 relative`}
        >
          <BsArrowLeftShort
            className={`bg-white text-terra-navy text-3xl rounded-full absolute -right-4 top-8 border border-terra-navy cursor-pointer z-50 ${
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
              <img
                src={TerrariumLettersImg}
                alt="name"
                className="max-w-none"
              />
            </h1>
          </div>
          <div
            className={`tour__search flex items-center mt-6 bg-terra-darknavy border border-terra-text-muted rounded-lg py-3 ${
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
              placeholder="Txs, blocks, addresses..."
              className={`text-sm bg-transparent w-full text-white placeholder:text-terra-text-muted focus:outline-none duration-300 ${
                !open && 'hidden'
              }`}
            />
          </div>
          <ul className={`py-2 mt-2 ${open ? '' : ''}`}>
            {menu.map((menuItem) => {
              if (menuItem.name === 'Settings') {
                return (
                  <div className="absolute bottom-0 left-0 w-full p-5">
                    <button
                      key={menuItem.name}
                      type="button"
                      onClick={() => handleToggleOpen(
                        <SettingsModal
                          handleToggleClose={handleToggleClose}
                        />,
                      )}
                      className={`flex bg-terra-darknavy h-[52px] w-full space-x-1 items-center rounded-md hover:border-2 hover:border-terra-text-muted
                      ${
                        open
                          ? 'px-3 hover:px-[calc(0.75rem-2px)]'
                          : 'justify-center'
                      }`}
                    >
                      <div
                        className={`float-left h-15 w-15 ${
                          open ? 'mr-2' : 'block'
                        }`}
                      >
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
                  </div>
                );
              }
              return (
                <NavLink
                  key={menuItem.name}
                  to={menuItem.path}
                  className={`${menuItem.name} ${
                    open ? 'px-3' : 'justify-center'
                  } h-12`}
                >
                  <div className={`float-left ${open ? 'mr-2' : 'block'}`}>
                    {menuItem.icon}
                  </div>
                  <div
                    className={`text-base font-medium flex-1 items-center cursor-pointer leading-[21px] ${
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

        <div className="relative flex-auto w-full h-screen overflow-hidden">
          <header className="absolute w-full bg-white z-40 flex justify-between p-6 pl-12 border-b border-[#CFD8EA] shadow-light-bottom">
            <ul className="flex flex-row w-full gap-1 lg:gap-10 xl:gap-20 items-center font-medium">
              <li className="tour__current-block flex-col px-2 font-medium text-xs text-terra-navy whitespace-nowrap">
                <p className="text-terra-text-muted md:text-md">
                  Current Block
                </p>
                <p className="text-lg md:leading-7 text-terra-text">
                  {latestHeight}
                </p>
              </li>
              <li className="flex-col px-2 font-medium text-xs text-terra-navy whitespace-nowrap">
                <p className="text-terra-text-muted md:text-md">Network ID</p>
                <p className="text-lg md:leading-7 text-terra-text">
                  {terra.config.chainID}
                </p>
              </li>
              <li className="flex-col px-2 font-medium text-xs text-terra-navy whitespace-nowrap">
                <p className="text-terra-text-muted md:text-md">RPC Server</p>
                <p className="text-lg md:leading-7 text-terra-text">
                  {terra.config.URL}
                </p>
              </li>
              <li className="ml-auto">
                <button
                  type="button"
                  onClick={debouncedToggleLocalTerra}
                  className={`${isLoading ? 'cursor-pointer' : ''}
                  tour__toggle-terra flex items-center justify-center py-1.5 px-3 space-x-1.5 rounded bg-terra-background-gray border-2 border-terra-button-secondary`}
                >
                  <BsCircleFill
                    className={`w-[8px]
                      ${
                        isLoading
                          ? 'text-is-loading-yellow'
                          : hasStartedLocalTerra.get()
                            ? 'text-is-connected-green'
                            : 'text-not-connected-red'
                      }
                    `}
                  />
                  <p className="text-terra-text text-xs font-normal">
                    Local Terra
                  </p>
                </button>
              </li>
            </ul>
          </header>
          <main className="flex w-full h-full overflow-hidden pt-[92px]">
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
