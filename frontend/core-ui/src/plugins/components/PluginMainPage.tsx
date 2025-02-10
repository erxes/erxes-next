import React, { lazy } from 'react';

import { loadRemote } from '@module-federation/enhanced/runtime';

export function PluginMainPage({ pluginName }: { pluginName: string }) {
  const Plugin = lazy(() => {
    return loadRemote<{ default: React.ComponentType }>(
      `${pluginName}/Module`,
      {
        from: 'runtime',
      },
    ) as Promise<{ default: React.ComponentType }>;
  });

  return (
    <React.Suspense fallback={<></>}>
      <Plugin />
    </React.Suspense>
  );
}
