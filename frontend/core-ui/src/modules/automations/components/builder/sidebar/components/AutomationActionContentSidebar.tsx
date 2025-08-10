import { AutomationCoreActionSidebarContent } from '@/automations/components/builder/sidebar/components/AutomationCoreActionSidebarContent';
import { ErrorState } from '@/automations/utils/ErrorState';
import { RenderPluginsComponentWrapper } from '@/automations/utils/RenderPluginsComponentWrapper';
import { Button, Card, Spinner, toast } from 'erxes-ui';
import { Suspense, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getAutomationTypes } from 'ui-modules';
import { useAutomationActionContentSidebar } from '../hooks/useAutomationActionContentSidebar';

export const AutomationActionContentSidebar = () => {
  const formRef = useRef<{ submit: () => void }>(null);
  const {
    currentIndex,
    isCoreActionComponent,
    currentAction,
    control,
    setQueryParams,
    setValue,
    toggleSideBarOpen,
  } = useAutomationActionContentSidebar();

  if (!currentAction || currentIndex === -1) {
    return <Card.Content>Something went wrong</Card.Content>;
  }

  if (!isCoreActionComponent) {
    const [pluginName, moduleName] = getAutomationTypes(
      currentAction?.type || '',
    );
    const onSaveActionConfig = (config: any) => {
      setValue(`actions.${currentIndex}.config`, config);
      setQueryParams({ activeNodeId: null });
      toggleSideBarOpen();
      toast({
        title: 'Action configuration added successfully.',
      });
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 w-auto">
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
                  formRef: formRef,
                  componentType: 'actionForm',
                  type: currentAction?.type,
                  currentAction,
                  onSaveActionConfig,
                }}
              />
            </ErrorBoundary>
          </Suspense>
        </div>
        <div className="p-2 flex justify-end border-t bg-white">
          <Button onClick={() => formRef.current?.submit()}>Save</Button>
        </div>
      </div>
    );
  }

  return (
    <AutomationCoreActionSidebarContent
      control={control}
      currentIndex={currentIndex}
      currentAction={currentAction}
    />
  );
};
