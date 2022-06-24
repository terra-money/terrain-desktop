import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from './package';
import {ElectronContextProvider} from './context/ElectronContextProvider';

ReactDOM.render(
  <React.StrictMode>
    <ElectronContextProvider>
      <Provider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ElectronContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
