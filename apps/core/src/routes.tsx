import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense } from 'react';

const App = React.lazy(() => import('./app/app'));
const InboxPage = React.lazy(() => import('./routes/plugins/inbox'));
const TaskPage = React.lazy(() => import('./routes/plugins/task'));
const SettingsPage = React.lazy(() => import('./routes/settings/routes'));

export const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <Suspense fallback={<div>Loading App...</div>}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: 'inbox/*',
        element: (
          <Suspense fallback={<div>Loading Inbox...</div>}>
            <InboxPage />
          </Suspense>
        ),
      },
      {
        path: 'tasks/*',
        element: (
          <Suspense fallback={<div>Loading Tasks...</div>}>
            <TaskPage />
          </Suspense>
        ),
      },
      {
        path: 'settings/*',
        element: (
          <Suspense fallback={<div>Loading Settings...</div>}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
]);
