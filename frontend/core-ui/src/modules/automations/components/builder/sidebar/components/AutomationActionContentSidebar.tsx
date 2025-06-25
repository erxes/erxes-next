import { ErrorState } from '@/automations/utils/ErrorState';
import { Card, Form, Spinner, toast } from 'erxes-ui';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAutomationActionContentSidebar } from '../hooks/useAutomationActionContentSidebar';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';
import { getAutomationTypes } from 'ui-modules';
import { coreActionNames } from '../../nodes/actions/CoreActions';
import { RenderPluginsComponentWrapper } from '@/automations/utils/RenderPluginsComponentWrapper';

export const AutomationActionContentSidebar = () => {
  const {
    currentIndex,
    Component,
    currentAction,
    control,
    setQueryParams,
    setValue,
  } = useAutomationActionContentSidebar();

  if (!currentAction || currentIndex === -1) {
    return <Card.Content>Something went wrong</Card.Content>;
  }

  const isCoreAction = coreActionNames.includes(currentAction?.type || '');

  if (!isCoreAction) {
    const [pluginName, moduleName] = getAutomationTypes(
      currentAction?.type || '',
    );
    const onSaveActionConfig = (config: any) => {
      setValue(`detail.actions.${currentIndex}.config`, config);
      setQueryParams({ activeNodeId: null });
      setValue('isMinimized', true);
      toast({
        title: 'Action configuration added successfully.',
      });
    };

    return (
      <Suspense fallback={<Spinner />}>
        <ErrorBoundary
          FallbackComponent={({ resetErrorBoundary }) => (
            <ErrorState onRetry={resetErrorBoundary} />
          )}
        >
          <RenderPluginsComponentWrapper
            pluginName={pluginName}
            moduleName={moduleName}
            props={{
              componentType: 'actionForm',
              type: currentAction?.type,
              currentAction,
              onSaveActionConfig,
            }}
          />
        </ErrorBoundary>
      </Suspense>
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
