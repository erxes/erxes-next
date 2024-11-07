import React from 'react';
const PluginInbox = React.lazy(() => import('plugin_inbox/Module'));

export default function InboxPage() {
  return (
    <React.Suspense>
      <PluginInbox />
    </React.Suspense>
  );
}
