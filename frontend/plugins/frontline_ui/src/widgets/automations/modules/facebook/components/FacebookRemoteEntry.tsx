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
import { AutomationHistoryName } from '~/widgets/automations/modules/facebook/components/AutomationHistoryName';
import { AutomationHistoryResult } from '~/widgets/automations/modules/facebook/components/AutomationHistoryResult';
import { CommentTriggerForm } from '~/widgets/automations/modules/facebook/components/trigger/components/CommentTriggerForm';
import { CommentActionForm } from '~/widgets/automations/modules/facebook/components/action/components/CommentActionForm';

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
      return <AutomationBotsRecordTable />;
    case 'historyName':
      return (
        <AutomationHistoryName
          {...(props as AutomationRemoteEntryTypes['HistoryName'])}
        />
      );
    case 'historyActionResult':
      return (
        <AutomationHistoryResult
          {...(props as AutomationRemoteEntryTypes['ActionResult'])}
        />
      );

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
    case 'comments':
      return <CommentActionForm {...props} />;
    default:
      return null;
  }
}

function renderTriggerForm(props: AutomationRemoteEntryTypes['TriggerForm']) {
  const triggerType = props.activeTrigger?.type || '';
  const [_pluginName, _moduleName, contentType] =
    getAutomationTypes(triggerType);

  console.log({ contentType });

  switch (contentType) {
    case 'messages':
      return <MessageTriggerForm {...props} />;
    // Add other cases as needed
    case 'comments':
      return <CommentTriggerForm {...props} />;
    default:
      return null;
  }
}
