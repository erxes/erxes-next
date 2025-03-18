import React, { lazy } from 'react';

import { loadRemote } from '@module-federation/enhanced/runtime';
import { Spinner } from 'erxes-ui';

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
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      }
    >
      <Plugin />
    </React.Suspense>
  );
}
