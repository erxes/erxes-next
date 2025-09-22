import { getCoreAutomationActionComponent } from '@/automations/components/builder/nodes/actions/coreAutomationActions';
import { TAutomationActionComponent } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';
import { ErrorState } from '@/automations/components/common/ErrorState';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { Card, Form, Spinner } from 'erxes-ui';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Control } from 'react-hook-form';

type Props = {
  control: Control<TAutomationBuilderForm>;
  currentIndex: number;
  currentAction: TAutomationBuilderForm['actions'][number];
  onSaveActionConfigCallback: () => void;
};

export const AutomationCoreActionSidebarContent = ({
  control,
  currentIndex,
  currentAction,
  onSaveActionConfigCallback,
}: Props) => {
  const Component = getCoreAutomationActionComponent(
    currentAction.type,
    TAutomationActionComponent.Sidebar,
  );

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
          name={`actions.${currentIndex}.config`}
          control={control}
          render={({ field }) => (
            <Component
              currentActionIndex={currentIndex}
              currentAction={currentAction}
              handleSave={(config) => {
                field.onChange({
                  ...(currentAction?.config || {}),
                  ...config,
                });
                onSaveActionConfigCallback();
              }}
            />
          )}
        />
      </ErrorBoundary>
    </Suspense>
  );
};
