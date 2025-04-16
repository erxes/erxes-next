import { loadRemote } from '@module-federation/enhanced/runtime';
import { Spinner } from 'erxes-ui';
import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface WidgetsComponentProps {
  pluginName: string;
}

interface PluginError {
  message: string;
  code?: string;
}

export function WidgetsComponent({
  pluginName,
  ...props
}: WidgetsComponentProps) {
  const [plugin, setPlugin] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PluginError | null>(null);

  useEffect(() => {
    async function loadPlugin() {
      try {
        setIsLoading(true);
        setError(null);

        const remoteModule = await loadRemote<{ default: React.ComponentType }>(
          `${pluginName}_ui/Widgets`,
          { from: 'runtime' },
        );

        if (!remoteModule?.default) {
          throw new Error('Plugin module is empty or invalid');
        }

        setPlugin(() => remoteModule.default);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Failed to load plugin',
          code: 'PLUGIN_LOAD_ERROR',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadPlugin();
  }, [pluginName]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-destructive text-sm">
          <p className="font-medium">Error loading plugin:</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !plugin) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  const PluginComponent = plugin;

  return (
    <ErrorBoundary fallback="Failed to render plugin">
      <PluginComponent {...props} />
    </ErrorBoundary>
  );
}
