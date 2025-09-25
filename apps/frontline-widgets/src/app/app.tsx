import { Route, Routes, Link } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from '../client';

import { ErxesMessenger } from './messenger/components/erxes-messenger';

export function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                This is the generated root route.{' '}
                <Link to="/erxes-messenger">
                  Click here for erxes messenger.
                </Link>
              </div>
            }
          />
          <Route path="/erxes-messenger" element={<ErxesMessenger />} />
        </Routes>
        {/* END: routes */}
      </div>
    </ApolloProvider>
  );
}

export default App;
