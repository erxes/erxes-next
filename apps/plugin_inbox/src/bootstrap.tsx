import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import './styles.css';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from 'erxes-ui';

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
