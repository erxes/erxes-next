import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { ErrorState } from '@/automations/utils/ErrorState';
import { Card, Form, Spinner } from 'erxes-ui/components';
import { useQueryState } from 'erxes-ui/hooks';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useFormContext } from 'react-hook-form';

const Delay = lazy(() =>
  import('./Delay').then((module) => ({
    default: module.Delay,
  })),
);

const IF = lazy(() =>
  import('./If').then((module) => ({
    default: module.IF,
  })),
);

const ManageProperties = lazy(() =>
  import('./ManageProperties').then((module) => ({
    default: module.ManageProperties,
  })),
);
const AutomationSendEmail = lazy(() =>
  import('./sendEmail').then((module) => ({
    default: module.AutomationSendEmail,
  })),
);

const Actions: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  delay: Delay,
  if: IF,
  setProperty: ManageProperties,
  sendEmail: AutomationSendEmail,
};

export const ActionDetail = () => {
  const [activeNodeId] = useQueryState('activeNodeId');
  const { watch, control } = useFormContext<TAutomationProps>();

  const actions = watch(`detail.actions`) || [];
  const currentIndex = actions.findIndex(
    (action) => action.id === activeNodeId,
  );

  if (currentIndex === -1) {
    return <Card.Content>Something went wrong</Card.Content>;
  }

  const currentAction = watch(`detail.actions.${currentIndex}`);
  const Component = Actions[currentAction.type];

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
