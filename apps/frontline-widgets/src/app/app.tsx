import { Route, Routes, Link } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from '../client';
import { Button } from 'erxes-ui';

import { ErxesMessenger } from './messenger/components/erxes-messenger';

export function App() {
  return (
    <ApolloProvider client={client}>
      <Routes>
        <Route
          path="/"
          element={
            <Button>
              This is the generated root route.{' '}
              <Link to="/erxes-messenger">Click here for erxes messenger.</Link>
            </Button>
          }
        />
        <Route path="/erxes-messenger" element={<ErxesMessenger />} />
      </Routes>
      {/* END: routes */}
    </ApolloProvider>
  );
}

export default App;
