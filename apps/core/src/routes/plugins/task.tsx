import React from 'react';
const PluginTask = React.lazy(() => import('plugin_task/Module'));

export default function TaskPage() {
  return (
    <React.Suspense>
      <PluginTask />
    </React.Suspense>
  );
}
