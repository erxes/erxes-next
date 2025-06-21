import {
  AutomaitionRemoteEntryProps,
  AutomaitionRemoteEntryTypes,
  getAutomationTypes,
} from 'ui-modules';
import { ActionConfigContent } from './action/components/ActionConfigContent';
import { MessageActionForm } from './action/components/MessageActionForm';
import { MessageTriggerForm } from './trigger/components/MessageTriggerForm';
import { TriggerConfigContent } from './trigger/components/TriggerConfigContent';

export const FacebookRemoteEntry = (props: AutomaitionRemoteEntryProps) => {
  const { componentType = '' } = props;

  switch (componentType) {
    case 'actionForm':
      return renderActionForm(
        props as AutomaitionRemoteEntryTypes['ActionForm'],
      );

    case 'triggerForm':
      return renderTriggerForm(
        props as AutomaitionRemoteEntryTypes['TriggerForm'],
      );

    case 'triggerConfigContent':
      return (
        <TriggerConfigContent
          {...(props as AutomaitionRemoteEntryTypes['TriggerNodeConfig'])}
        />
      );

    case 'actionNodeConfiguration':
      return (
        <ActionConfigContent
          {...(props as AutomaitionRemoteEntryTypes['ActionNodeConfig'])}
        />
      );

    default:
      return null;
  }
};

// Helper functions
function renderActionForm(props: AutomaitionRemoteEntryTypes['ActionForm']) {
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

function renderTriggerForm(props: AutomaitionRemoteEntryTypes['TriggerForm']) {
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
