import WebhooksComponents from '@/automations/components/builder/nodes/triggers/webhooks/Webhooks';

const coreTriggers = {
  ...WebhooksComponents,
};

type TriggerName = keyof typeof coreTriggers;
export enum CoreComponentType {
  Sidebar = 'sidebar',
  NodeContent = 'nodeContent',
}
type TriggerComponents = {
  sidebar?: React.LazyExoticComponent<any>;
  nodeContent?: React.LazyExoticComponent<any>;
};

export function isCoreAutomationTriggerType(
  triggerName: TriggerName,
  componentType: CoreComponentType,
): boolean {
  const trigger = coreTriggers[triggerName];
  return trigger !== undefined && componentType in trigger;
}

// // Alternative version that returns the component if it exists
export function getCoreAutomationTriggerComponent(
  triggerName: TriggerName,
  componentType: CoreComponentType,
): React.LazyExoticComponent<React.ComponentType<any>> | null {
  if (isCoreAutomationTriggerType(triggerName, componentType)) {
    return (
      (coreTriggers[triggerName] as TriggerComponents)?.[componentType] ?? null
    );
  }
  return null;
}
