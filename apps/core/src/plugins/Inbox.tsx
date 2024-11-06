import React from 'react';
const Inbox = React.lazy(() => import('plugin_inbox/Module'));

export default function InboxPage() {
  return (
    <React.Suspense fallback="Loading Shop">
      <Inbox />
    </React.Suspense>
  );
}
