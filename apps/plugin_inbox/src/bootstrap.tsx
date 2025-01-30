import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router';
import * as ReactDOM from 'react-dom/client';

import { Sidebar } from 'erxes-ui';

import App from './app/app';

import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter basename="/inbox">
      <Sidebar.Provider>
        <App />
      </Sidebar.Provider>
    </BrowserRouter>
  </StrictMode>
);
