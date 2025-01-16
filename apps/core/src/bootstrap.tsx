import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles.css';
import { App } from '@/app/components/App';
import { REACT_APP_API_URL, NODE_ENV } from 'erxes-ui/utils';
import { init } from '@module-federation/enhanced/runtime';
import { NuqsAdapter } from 'nuqs/adapters/react';

// Initialize module federation before rendering
const initFederation = async () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  if (NODE_ENV === 'development') {
    root.render(
      <StrictMode>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </StrictMode>
    );
  } else {
    fetch(`${REACT_APP_API_URL}/get-frontend-plugins`)
      .then((res) => res.json())
      .then((data) => {
        init({
          name: 'core',
          remotes: data.plugins?.map((plugin) => ({
            name: `plugin_${plugin.name}`,
            entry: plugin.url,
          })),
        });

        root.render(
          <StrictMode>
            <NuqsAdapter>
              <App />
            </NuqsAdapter>
          </StrictMode>
        );
      });
  }
};

initFederation().catch((err) => {
  console.error('Failed to initialize module federation:', err);
});
