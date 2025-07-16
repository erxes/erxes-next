import { BlurWrapper } from '@/notification/settings/components/BlurWrapper';
import { NotifTypeRow } from '@/notification/settings/components/NotifTypeRow';
import { useNotificationPluginsTypes } from '@/notification/settings/hooks/useNotificationPluginsTypes';
import { useNotificationSettings } from '@/notification/settings/hooks/useNotificationSettings';
import { useUserNotificationSettings } from '@/notification/settings/hooks/useUserNotificationSettings';
import { TNotificationSettingsForm } from '@/notification/settings/states/notificationSettingsForm';
import {
  ModuleNotificationSettingsProps,
  NotifTypeNotificationSettingsProps,
  PluginNotificationSettingsProps,
} from '@/notification/settings/types/notificationSettings';
import { IconBellRinging, IconChevronDown } from '@tabler/icons-react';
import {
  Button,
  Collapsible,
  Form,
  IconComponent,
  Label,
  Separator,
  Spinner,
} from 'erxes-ui';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SettingsHeader } from 'ui-modules';

export const NotificationSettings = () => {
  const { pluginsNotifications, loading } = useNotificationPluginsTypes();
  const {
    userNotificationSettings,
    loading: userNotificationSettingsLoading,
    refetch,
  } = useUserNotificationSettings();

  const {
    isOrgDefault,
    toggleOrgDefault,
    form,
    isDisabledAllNotification,
    onNotiTypeChecked,
  } = useNotificationSettings(refetch);

  useEffect(() => {
    console.log({ userNotificationSettings });
    if (userNotificationSettings) {
      form.reset({
        all: {
          inAppNotificationsDisabled:
            userNotificationSettings.inAppNotificationsDisabled || false,
          emailNotificationsDisabled:
            userNotificationSettings.emailNotificationsDisabled || false,
        },
        plugins: userNotificationSettings.plugins || {},
      });
    }
  }, [userNotificationSettings]);
  if (loading || userNotificationSettingsLoading) {
    return <Spinner />;
  }
  const onCheckGlobal =
    (type: 'email' | 'inApp', checked: boolean) =>
    (
      value: {
        inAppNotificationsDisabled: boolean;
        emailNotificationsDisabled: boolean;
      },
      onChange: (...event: any[]) => void,
    ) => {
      const fieldName =
        type === 'email'
          ? 'emailNotificationsDisabled'
          : 'inAppNotificationsDisabled';
      const fieldChange = {
        ...value,
        [fieldName]: !checked,
      };

      onChange(fieldChange);
    };

  console.log(form.watch(['all', 'plugins']));
  return (
    <>
      <SettingsHeader
        breadcrumbs={
          <Button variant="ghost" className="font-semibold">
            <IconBellRinging className="w-4 h-4 text-accent-foreground" />
            Notification Settings
          </Button>
        }
      />

      <Form {...form}>
        <form className="w-full pt-8 h-full flex flex-col">
          <div className="w-full mx-auto max-w-3xl mb-6">
            <div className="flex justify-between items-center my-4">
              <div>
                <h2 className="font-semibold text-lg">
                  {isOrgDefault ? 'Organization' : 'My'} Notification Settings
                </h2>
                <span className="text-accent-foreground text-xs ">
                  Select push and email notifications you'd like to receive{' '}
                </span>
              </div>
              <Button
                variant="link"
                onClick={() => toggleOrgDefault(!isOrgDefault)}
              >
                Edit {isOrgDefault ? 'my' : 'organization'} default
                notifications
              </Button>
            </div>
            <Separator />
            <div className="py-4">
              <Form.Field
                control={form.control}
                name="all"
                render={({ field: { value, onChange } }) => (
                  <Form.Item>
                    <NotifTypeRow
                      titleClassName="text-md"
                      title="Enable all notifications"
                      description="Turn on/off all notification channels"
                      enabled={{
                        email: !value?.emailNotificationsDisabled,
                        inApp: !value?.inAppNotificationsDisabled,
                      }}
                      onCheck={(type, checked) =>
                        onCheckGlobal(type, checked)(value, onChange)
                      }
                    />
                  </Form.Item>
                )}
              />
            </div>
          </div>
          <BlurWrapper
            isDisabled={isDisabledAllNotification}
            className="flex-1 overflow-auto"
          >
            <div className="mx-auto max-w-3xl">
              {pluginsNotifications.map(({ pluginName, modules }) => (
                <PluginNotificationContent
                  key={pluginName}
                  pluginName={pluginName}
                  modules={modules}
                  onNotiTypeChecked={onNotiTypeChecked}
                />
              ))}
            </div>
          </BlurWrapper>
        </form>
      </Form>
    </>
  );
};

const PluginNotificationContent = ({
  pluginName,
  modules,
  onNotiTypeChecked,
}: PluginNotificationSettingsProps) => {
  const { control } = useFormContext<TNotificationSettingsForm>();

  return (
    <Collapsible key={pluginName} defaultOpen>
      <Collapsible.Trigger asChild>
        <h3 className="flex flex-row items-center justify-between text-bold capitalize cursor-pointer">
          {pluginName} <IconChevronDown className="size-4" />
        </h3>
      </Collapsible.Trigger>
      <Separator className="mt-4" />
      <Collapsible.Content className="mt-2 p-2">
        <Form.Field
          control={control}
          name="plugins"
          render={({ field }) => {
            const pluginConfigState = field.value[pluginName] || {};

            return (
              <Form.Item>
                {modules.map(
                  ({
                    name: moduleName,
                    description,
                    icon: iconName,
                    types,
                  }) => (
                    <div key={moduleName}>
                      <ModuleNotificationContent
                        field={field}
                        pluginName={pluginName}
                        pluginConfigState={pluginConfigState}
                        moduleName={moduleName}
                        iconName={iconName}
                        description={description}
                        types={types}
                        onNotiTypeChecked={onNotiTypeChecked}
                      />
                      <Separator />
                    </div>
                  ),
                )}
              </Form.Item>
            );
          }}
        />
      </Collapsible.Content>
    </Collapsible>
  );
};

const ModuleNotificationContent = ({
  field,
  pluginName,
  moduleName,
  iconName,
  description,
  types,
  pluginConfigState,
  onNotiTypeChecked,
}: ModuleNotificationSettingsProps) => {
  return (
    <div key={moduleName} className="flex flex-row">
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
              onNotiTypeChecked={onNotiTypeChecked}
              pluginConfigState={pluginConfigState}
              field={field}
            />
          );
        })}
      </div>
    </div>
  );
};

const NotifTypeRowContent = ({
  pluginName,
  text,
  notifType,
  onNotiTypeChecked,
  pluginConfigState,
  notifTypeState,
  field,
}: NotifTypeNotificationSettingsProps) => {
  const [isAllInpAppDisabled, isAllEmailDisabled] = useWatch({
    name: ['all.isInAppDisabled', 'all.isEmailDisabled'],
  });
  const isEmailEnabled = isAllEmailDisabled || notifTypeState?.emailDisabled;
  const isInAppEnabled = isAllInpAppDisabled || notifTypeState?.inAppDisabled;

  return (
    <NotifTypeRow
      key={notifType}
      title={text}
      enabled={{
        email: !isEmailEnabled,
        inApp: !isInAppEnabled,
      }}
      onCheck={(type, checked) =>
        onNotiTypeChecked(
          {
            fieldOnChange: field.onChange,
            fieldValue: field.value,
            pluginName,
            pluginConfigState,
            notifType,
          },
          type,
          checked,
        )
      }
    />
  );
};
