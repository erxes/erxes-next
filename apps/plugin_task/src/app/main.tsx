import * as React from 'react';

import NxWelcome from './nx-welcome';

import {
  BreadcrumbSeparator,
  BreadcrumbList,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Header,
} from 'erxes-ui';

import { Route, Routes } from 'react-router-dom';

const PluginInbox = React.lazy(() => import('plugin_inbox/Module'));

export function App() {
  return (
    <>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/tasks">dsadsa</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </BreadcrumbList>
        </Breadcrumb>
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
