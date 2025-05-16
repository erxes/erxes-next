import { Card, Spinner } from 'erxes-ui/components';
import { useQueryState } from 'erxes-ui/hooks';
import { lazy, Suspense } from 'react';
import { useFormContext } from 'react-hook-form';
import { TAutomationProps } from '../common/formSchema';
import { IActionProps } from 'ui-modules';

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

const Actions: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  delay: Delay,
  if: IF,
};
type Props = {
  //   type: string;
};

export const ActionDetail = ({}: Props) => {
  const [activeNodeId] = useQueryState('activeNodeId');
  const { watch, setValue } = useFormContext<TAutomationProps>();

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

  const handleSave = (config: any) => {
    setValue(`detail.actions.${currentIndex}.config`, {
      ...(currentAction?.config || {}),
      ...config,
    });
  };

  const updatedProps: IActionProps = {
    currentActionIndex: currentIndex,
    currentAction,
    handleSave,
  };

  return (
    <Suspense fallback={<Spinner />}>
      <Card.Content>
        <Component {...updatedProps} />
      </Card.Content>
    </Suspense>
  );
};
