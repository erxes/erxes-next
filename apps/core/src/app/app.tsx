import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Link, Route, Routes } from 'react-router-dom';

const PluginTask = React.lazy(() => import('plugin_task/Module'));

const PluginInbox = React.lazy(() => import('plugin_inbox/Module'));

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/plugin-task">PluginTask</Link>
        </li>
        <li>
          <Link to="/plugin-task">PluginTask</Link>
        </li>
        <li>
          <Link to="/inbox">PluginInbox</Link>
        </li>
        <li>
          <Link to="/inbox">Inbox</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="core" />} />
        <Route path="/plugin-task" element={<PluginTask />} />
        <Route path="/inbox" element={<PluginInbox />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
