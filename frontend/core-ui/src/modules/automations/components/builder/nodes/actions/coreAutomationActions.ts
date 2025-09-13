import AiAgentComponents from '@/automations/components/builder/nodes/actions/aiAgent/components/AiAgent';
import BranchComponents from '@/automations/components/builder/nodes/actions/branches/components/Branches';
import DelayComponents from '@/automations/components/builder/nodes/actions/delay/components/Delay';
import ManagePropertiesComponents from '@/automations/components/builder/nodes/actions/manageProperties/components/ManageProperties';
import SendEmailComponents from '@/automations/components/builder/nodes/actions/sendEmail/components/SendEmail';
import WaitEventComponents from '@/automations/components/builder/nodes/actions/waitEvent/components/WaitEvent';
import WebhooksComponents from '@/automations/components/builder/nodes/actions/webhooks/Webhooks';

const coreActions = {
  ...DelayComponents,
  ...BranchComponents,
  ...ManagePropertiesComponents,
  ...SendEmailComponents,
  ...WaitEventComponents,
  ...AiAgentComponents,
  ...WebhooksComponents,
};

type ActionName = keyof typeof coreActions;
export enum CoreComponentType {
  Sidebar = 'sidebar',
  NodeContent = 'nodeContent',
  ActionResult = 'actionResult',
}
type ActionComponents = {
  sidebar?: React.LazyExoticComponent<any>;
  nodeContent?: React.LazyExoticComponent<any>;
  actionResult?: React.LazyExoticComponent<any>;
};

export function isCoreAutomationActionType(
  actionName: ActionName,
  componentType: CoreComponentType,
): boolean {
  const action = coreActions[actionName];
  return action !== undefined && componentType in action;
}

// // Alternative version that returns the component if it exists
export function getCoreAutomationActionComponent(
  actionName: ActionName,
  componentType: CoreComponentType,
): React.LazyExoticComponent<React.ComponentType<any>> | null {
  if (isCoreAutomationActionType(actionName, componentType)) {
    return (
      (coreActions[actionName] as ActionComponents)?.[componentType] ?? null
    );
  }
  return null;
}
