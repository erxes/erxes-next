import {
  AutomationRemoteEntryProps,
  AutomationRemoteEntryTypes,
  getAutomationTypes,
} from 'ui-modules';
import { ActionConfigContent } from './action/components/ActionConfigContent';
import { MessageActionForm } from './action/components/MessageActionForm';
import { MessageTriggerForm } from './trigger/components/MessageTriggerForm';
import { TriggerConfigContent } from './trigger/components/TriggerConfigContent';
import { AutomationBotsRecordTable } from './bots/components/automationBotsRecordTable';

export const FacebookRemoteEntry = (props: AutomationRemoteEntryProps) => {
  const { componentType = '' } = props;

  switch (componentType) {
    case 'actionForm':
      return renderActionForm(
        props as AutomationRemoteEntryTypes['ActionForm'],
      );

    case 'triggerForm':
      return renderTriggerForm(
        props as AutomationRemoteEntryTypes['TriggerForm'],
      );

    case 'triggerConfigContent':
      return (
        <TriggerConfigContent
          {...(props as AutomationRemoteEntryTypes['TriggerNodeConfig'])}
        />
      );

    case 'actionNodeConfiguration':
      return (
        <ActionConfigContent
          {...(props as AutomationRemoteEntryTypes['ActionNodeConfig'])}
        />
      );
    case 'automationBotsContent':
      return <AutomationBotsRecordTable {...props} />;

    default:
      return null;
  }
};

// Helper functions
function renderActionForm(props: AutomationRemoteEntryTypes['ActionForm']) {
  const actionType = props.currentAction?.type || '';
  const [_pluginName, _moduleName, contentType] =
    getAutomationTypes(actionType);

  switch (contentType) {
    case 'messages':
      return <MessageActionForm {...props} />;
    // Add other cases as needed
    default:
      return null;
  }
}

function renderTriggerForm(props: AutomationRemoteEntryTypes['TriggerForm']) {
  const triggerType = props.activeTrigger?.type || '';
  const [_pluginName, _moduleName, contentType] =
    getAutomationTypes(triggerType);

  switch (contentType) {
    case 'messages':
      return <MessageTriggerForm {...props} />;
    // Add other cases as needed
    default:
      return null;
  }
}
