import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import Providers from '../providers/providers';

const PluginTask = React.lazy(() => import('plugin_task/Module'));

const PluginInbox = React.lazy(() => import('plugin_inbox/Module'));

export function App() {
  return (
    <Providers>
      <Layout>
        <React.Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<NxWelcome title="core" />} />
            <Route path="/plugin-task" element={<PluginTask />} />
            <Route path="/inbox" element={<PluginInbox />} />
          </Routes>
        </React.Suspense>
      </Layout>
    </Providers>
  );
}

export default App;
