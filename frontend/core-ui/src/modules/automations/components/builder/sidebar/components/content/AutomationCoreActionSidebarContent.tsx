import {
  CoreComponentType,
  getCoreAutomationActionComponent,
} from '@/automations/components/builder/nodes/actions/coreAutomationActions';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { ErrorState } from '@/automations/components/common/ErrorState';
import { Card, Form, Spinner } from 'erxes-ui';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Control } from 'react-hook-form';

type Props = {
  control: Control<TAutomationBuilderForm>;
  currentIndex: number;
  currentAction: TAutomationBuilderForm['actions'][number];
};

export const AutomationCoreActionSidebarContent = ({
  control,
  currentIndex,
  currentAction,
}: Props) => {
  const Component = getCoreAutomationActionComponent(
    currentAction.type as any,
    CoreComponentType.Sidebar,
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
