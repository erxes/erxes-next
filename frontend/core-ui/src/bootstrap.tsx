import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { init } from '@module-federation/enhanced/runtime';
import { NuqsAdapter } from 'nuqs/adapters/react';

import { NODE_ENV } from 'erxes-ui/utils/config';

import './styles.css';

import { App } from '@/app/components/App';
// import { ClientConfigError } from '@/error-handler/components/ClientConfigError';

const initFederation = async () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  );

  if (NODE_ENV === 'development') {
    root.render(
      <StrictMode>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </StrictMode>,
    );
  } else {
    // fetch(`${REACT_APP_API_URL}/get-frontend-plugins`)
    // .then((res) => res.json())
    // .then((data) => {
    init({
      name: 'core',
      remotes: [
        {
          name: 'inbox_ui',
          entry: 'https://plugins.erxes.io/latest/inbox_ui/remoteEntry.js',
        },
      ],
    });

    root.render(
      <StrictMode>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </StrictMode>,
    );
    // })
    // .catch((error: unknown) => {
    //   console.error(
    //     'Failed to initialize frontend plugins:',
    //     error instanceof Error ? error.message : String(error),
    //   );

    //   root.render(
    //     <StrictMode>
    //       <ClientConfigError
    //         error={
    //           error instanceof Error
    //             ? error
    //             : new Error('Failed to initialize frontend plugins')
    //         }
    //       />
    //     </StrictMode>,
    //   );
    // });
  }
};

initFederation().catch((err) => {
  console.error('Failed to initialize module federation:', err);
});
