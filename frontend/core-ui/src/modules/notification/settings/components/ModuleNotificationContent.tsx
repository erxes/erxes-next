import { NotifTypeRowContent } from '@/notification/settings/components/NotifTypeRowContent';
import { ModuleNotificationSettingsProps } from '@/notification/settings/types/notificationSettings';
import { IconComponent, Label } from 'erxes-ui';

export const ModuleNotificationContent = ({
  pluginName,
  iconName,
  description,
  types,
  pluginConfigState,
}: ModuleNotificationSettingsProps) => {
  return (
    <div className="flex flex-row">
      <Label className="flex gap-2 pt-2 w-1/5">
        <IconComponent name={iconName} className="size-4" />
        {description}
      </Label>
      <div className="px-4 w-4/5">
        {types.map(({ name: notifType, text }) => {
          const notifTypeState = (pluginConfigState?.types || {})[notifType];

          return (
            <NotifTypeRowContent
              key={notifType}
              pluginName={pluginName}
              text={text}
              notifType={notifType}
              notifTypeState={notifTypeState}
              pluginConfigState={pluginConfigState}
            />
          );
        })}
      </div>
    </div>
  );
};
