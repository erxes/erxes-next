import { loadRemote } from '@module-federation/enhanced/runtime';
import React, { lazy } from 'react';

export function PluginMainPage({ pluginName }: { pluginName: string }) {
  const Plugin = lazy(() => {
    return loadRemote<{ default: typeof Plugin }>(`${pluginName}/Module`, {
      from: 'runtime',
    }) as Promise<{ default: typeof Plugin }>;
  });

  return (
    <React.Suspense fallback={<></>}>
      <Plugin />
    </React.Suspense>
  );
}
