import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles.css';
import { App } from '@/app/components/App';
import { REACT_APP_API_URL } from 'erxes-ui/utils';

// Initialize module federation before rendering
const initFederation = async () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  // if (NODE_ENV === 'development') {
  //   root.render(
  //     <StrictMode>
  //       <App />
  //     </StrictMode>
  //   );
  // } else {
  fetch(`${REACT_APP_API_URL}/get-frontend-plugins`)
    .then((res) => res.json())
    .then((data) => {
      window.plugins = data.plugins || [];
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    });
  // }
};

initFederation().catch((err) => {
  console.error('Failed to initialize module federation:', err);
});
