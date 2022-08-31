import React from 'react';
import '@hookstate/devtools';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './styleOverrides.css';
import { TourProvider } from '@reactour/tour';
import App from './App';
import { Provider } from './components';
import { tourSteps } from './utils';
import { StateListeners } from './context/ElectronContextProvider';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <StateListeners />
    <Provider>
      <BrowserRouter>
        <TourProvider steps={tourSteps}>
          <App />
        </TourProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
