import { loadRemote } from '@module-federation/enhanced/runtime';
import React, { lazy } from 'react';

export default function PluginSettingsPage({
  pluginName,
}: {
  pluginName: string;
}) {
  const Plugin = lazy(() => {
    return loadRemote<{ default: typeof Plugin }>(
      `plugin_${pluginName}/Settings`,
      {
        from: 'runtime',
      }
    ) as Promise<{ default: typeof Plugin }>;
  });

  return (
    <React.Suspense fallback={<></>}>
      <Plugin />
    </React.Suspense>
  );
}
