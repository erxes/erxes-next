import { TriggerConfigContent } from './trigger/components/TriggerConfigContent';
import { MessageTriggerForm } from './trigger/components/MessageTriggerForm';
import { getAutomationTypes } from 'ui-modules';
import { MessageActionForm } from './action/components/MessageActionForm';

export const FacebookRemoteEntry = (props: any) => {
  const { componentType } = props || {};

  if (componentType === 'actionForm') {
    const { type: actionType = '' } = props?.currentAction || {};
    const [_pluginName, _moduleName, contentType] =
      getAutomationTypes(actionType);

    switch (contentType) {
      case 'messages':
        return <MessageActionForm {...props} />;
      //   case "comments":
      //     return <CommnetForm {...props} />;
      //   case "ads":
      //     return <AdsForm {...props} />;
      default:
        return null;
    }
  }

  if (componentType === 'triggerForm') {
    const { type: triggerType = '' } = props?.activeTrigger || {};
    const [_pluginName, _moduleName, contentType] =
      getAutomationTypes(triggerType);

    switch (contentType) {
      case 'messages':
        return <MessageTriggerForm {...props} />;
      //   case "comments":
      //     return <CommnetForm {...props} />;
      //   case "ads":
      //     return <AdsForm {...props} />;
      default:
        return null;
    }
  }

  if (componentType === 'triggerConfigContent') {
    const { config = {} } = props || {};

    return <TriggerConfigContent config={config} />;
  }
};
