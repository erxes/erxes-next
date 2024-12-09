import { loadRemote } from '@module-federation/enhanced/runtime';
import React, { lazy } from 'react';

export default function InboxPage() {
  const Inbox = lazy(() => {
    return loadRemote<{ default: typeof Inbox }>('plugin_inbox/Module', {
      from: 'runtime',
    }) as Promise<{ default: typeof Inbox }>;
  });

  return (
    <React.Suspense fallback="Loading Inbox">
      <Inbox />
    </React.Suspense>
  );
}
