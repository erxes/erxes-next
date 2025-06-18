import { ErrorState } from '@/automations/utils/ErrorState';
import { Card, Form, Spinner, toast } from 'erxes-ui';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAutomationActionContentSidebar } from '../hooks/useAutomationActionContentSidebar';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const AutomationActionContentSidebar = () => {
  const {
    currentIndex,
    Component,
    currentAction,
    control,
    setActiveNodeId,
    setValue,
  } = useAutomationActionContentSidebar();

  if (currentIndex === -1) {
    return <Card.Content>Something went wrong</Card.Content>;
  }

  const [pluginName, moduleName] = (currentAction?.type || '')
    .replace('.', ':')
    .split(':');

  if (pluginName !== 'core') {
    const onSaveActionConfig = (config: any) => {
      setValue(`detail.actions.${currentIndex}.config`, config);
      setActiveNodeId(null);
      setValue('isMinimized', true);
      toast({
        title: 'Action configuration added successfully.',
      });
    };

    return (
      <RenderPluginsComponent
        pluginName={`${pluginName}_ui`}
        remoteModuleName="automations"
        moduleName={moduleName}
        props={{
          componentType: 'actionForm',
          type: currentAction?.type,
          currentAction,
          onSaveActionConfig,
        }}
      />
    );
  }

  if (!Component) {
    return (
      <Card.Content>Unknown action type: {currentAction.type}</Card.Content>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <ErrorBoundary
        FallbackComponent={({ resetErrorBoundary }) => (
          <ErrorState onRetry={resetErrorBoundary} />
        )}
      >
        <Form.Field
          name={`detail.actions.${currentIndex}.config`}
          control={control}
          render={({ field }) => (
            <Component
              currentActionIndex={currentIndex}
              currentAction={currentAction}
              handleSave={(config: any) =>
                field.onChange({
                  ...(currentAction?.config || {}),
                  ...config,
                })
              }
            />
          )}
        />
      </ErrorBoundary>
    </Suspense>
  );
};
