import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Breadcrumb, Header } from 'erxes-ui';

import { Route, Routes } from 'react-router-dom';

const PluginInbox = React.lazy(() => import('plugin_inbox/Module'));

export function App() {
  return (
    <>
      <Header>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item className="hidden md:block">
              <Breadcrumb.Link href="/tasks">dsadsa</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator className="hidden md:block" />
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Header>
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="/tasks" element={<NxWelcome title="core" />} />
          <Route path="/tasks/teams" element={<div>teams</div>} />
          <Route path="/inbox" element={<PluginInbox />} />
        </Routes>
      </React.Suspense>
    </>
  );
}

export default App;
