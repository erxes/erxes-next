import React, { useEffect, useState, Suspense } from 'react';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { Spinner } from 'erxes-ui';

export function PluginSettingsPage({ pluginName }: { pluginName: string }) {
  const [Plugin, setPlugin] = useState<React.ComponentType | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPlugin = async () => {
      try {
        const remoteModule = await loadRemote<{ default: React.ComponentType }>(
          `${pluginName}/Settings`,
          { from: 'runtime' },
        );

        if (isMounted && remoteModule) {
          setPlugin(() => remoteModule.default);
          setHasError(false);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
          setPlugin(null);
        }
      }
    };

    setPlugin(null);
    loadPlugin();

    return () => {
      isMounted = false;
    };
  }, [pluginName]);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Failed to load plugin: {pluginName}
      </div>
    );
  }

  if (!Plugin) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      }
    >
      <Plugin />
    </Suspense>
  );
}
