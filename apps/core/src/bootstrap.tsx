import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles.css';
import { App } from '@/app/components/App';

// Initialize module federation before rendering
const initFederation = async () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

initFederation().catch((err) => {
  console.error('Failed to initialize module federation:', err);
});
