import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const PluginTask = React.lazy(() => import('plugin_task/Module'));

const PluginInbox = React.lazy(() => import('plugin_inbox/Module'));

export function App() {
  return (
    <Layout>
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<NxWelcome title="core" />} />
          <Route path="/tasks" element={<PluginTask />} />
          <Route path="/inbox" element={<PluginInbox />} />
        </Routes>
      </React.Suspense>
    </Layout>
  );
}

export default App;
