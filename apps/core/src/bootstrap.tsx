import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles.css';
import { App } from '@/app/components/App';
import { init } from '@module-federation/enhanced/runtime';

// Initialize module federation before rendering
const initFederation = async () => {
  init({
    name: 'core',
    remotes: [
      {
        name: 'plugin_inbox',
        entry:
          'https://3b48f883.erxes-next.pages.dev/plugin_inbox/remoteEntry.js',
      },
    ],
  });

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
