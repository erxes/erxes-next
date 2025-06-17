import { MessageTriggerForm } from './trigger/components/MessageTriggerForm';

export const FacebookRemoteEntry = (props: any) => {
  console.log({ props });
  const { componentType, activeTrigger } = props || {};
  console.log({ aci: activeTrigger?.type });

  if (componentType === 'triggerForm') {
    const { type: triggerType = '' } = activeTrigger || {};
    const [_pluginName, _moduleName, contentType] = triggerType
      .replace(':', '.')
      .split('.');

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
};
