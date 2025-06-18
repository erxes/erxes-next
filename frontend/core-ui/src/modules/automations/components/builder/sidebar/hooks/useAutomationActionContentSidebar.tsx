import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useQueryState } from 'erxes-ui';
import { lazy } from 'react';
import { useFormContext } from 'react-hook-form';

const Delay = lazy(() =>
  import('../../nodes/actions/delay/components/Delay').then((module) => ({
    default: module.Delay.SideBarContent,
  })),
);

const Branches = lazy(() =>
  import('../../nodes/actions/branches/components/Branches').then((module) => ({
    default: module.Branches,
  })),
);

const ManageProperties = lazy(() =>
  import(
    '../../nodes/actions/manageProperties/component/ManageProperties'
  ).then((module) => ({
    default: module.ManageProperties.SideBarContent,
  })),
);
const AutomationSendEmail = lazy(() =>
  import('../../nodes/actions/sendEmail/components/SendEmail').then(
    (module) => ({
      default: module.SendEmail.SideBarContent,
    }),
  ),
);

const Actions: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  delay: Delay,
  if: Branches,
  setProperty: ManageProperties,
  sendEmail: AutomationSendEmail,
};

export const useAutomationActionContentSidebar = () => {
  const [activeNodeId, setActiveNodeId] = useQueryState('activeNodeId');
  const { watch, control, setValue } = useFormContext<TAutomationProps>();

  const actions = watch(`detail.actions`) || [];
  const currentIndex = actions.findIndex(
    (action) => action.id === activeNodeId,
  );

  const currentAction = watch(`detail.actions.${currentIndex}`);
  const Component = Actions[currentAction?.type] || null;

  return {
    Component,
    control,
    currentIndex,
    currentAction,
    setActiveNodeId,
    setValue,
  };
};
