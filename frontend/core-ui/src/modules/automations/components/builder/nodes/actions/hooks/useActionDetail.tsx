import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useQueryState } from 'erxes-ui';
import { lazy } from 'react';
import { useFormContext } from 'react-hook-form';

const Delay = lazy(() =>
  import('../delay/components/Delay').then((module) => ({
    default: module.Delay.SideBarContent,
  })),
);

const IF = lazy(() =>
  import('../if/components/If').then((module) => ({
    default: module.IF,
  })),
);

const ManageProperties = lazy(() =>
  import('../manageProperties/component/ManageProperties').then((module) => ({
    default: module.ManageProperties.SideBarContent,
  })),
);
const AutomationSendEmail = lazy(() =>
  import('../sendEmail/components/SendEmail').then((module) => ({
    default: module.SendEmail.SideBarContent,
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

export const useActionDetail = () => {
  const [activeNodeId] = useQueryState('activeNodeId');
  const { watch, control } = useFormContext<TAutomationProps>();

  const actions = watch(`detail.actions`) || [];
  const currentIndex = actions.findIndex(
    (action) => action.id === activeNodeId,
  );

  const currentAction = watch(`detail.actions.${currentIndex}`);
  const Component = Actions[currentAction?.type] || null;

  return { Component, control, currentIndex, currentAction };
};
