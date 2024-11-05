import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Link, Route, Routes } from 'react-router-dom';

const Inbox = React.lazy(() => import('inbox/Module'));

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/inbox">Inbox</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="core" />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
