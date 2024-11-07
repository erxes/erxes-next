import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const PluginTask = React.lazy(() => import('plugin_task/Module'));

const PluginInbox = React.lazy(() => import('plugin_inbox/Module'));

export function App() {
  return (
    <Layout>
      {/* <ul className="flex gap-4 border-b border-gray-200">
        <li>
          <Link to="/">Home</Link>
          <Button>click me</Button>
        </li>
        <li>
          <Link to="/plugin-task">Task</Link>
        </li>
        <li>
          <Link to="/inbox">Inbox</Link>
        </li>
      </ul> */}
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<NxWelcome title="core" />} />
          <Route path="/plugin-task" element={<PluginTask />} />
          <Route path="/inbox" element={<PluginInbox />} />
        </Routes>
      </React.Suspense>
    </Layout>
  );
}

export default App;
