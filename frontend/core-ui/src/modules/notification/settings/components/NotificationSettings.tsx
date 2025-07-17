import { BlurWrapper } from '@/notification/settings/components/BlurWrapper';
import { GeneralNotificationSettings } from '@/notification/settings/components/GeneralNotificationSettings';
import { NotificationSettingsSkeleton } from '@/notification/settings/components/NotificationSettingsSkeleton';
import { PluginNotificationContent } from '@/notification/settings/components/PluginNotificationContent';
import {
  NotificationSettingsProvider,
  useNotificationsSettingsContext,
} from '@/notification/settings/context/NotificationSettingsContext';
import { useNotificationContent } from '@/notification/settings/hooks/useNotificationContent';
import { useNotificationPluginsTypes } from '@/notification/settings/hooks/useNotificationPluginsTypes';
import {
  onNotifTypeCheckedProp,
  useNotificationSettings,
} from '@/notification/settings/hooks/useNotificationSettings';
import { useUserNotificationSettings } from '@/notification/settings/hooks/useUserNotificationSettings';
import { IconBellRinging } from '@tabler/icons-react';
import { CommandItem } from 'cmdk';
import { Button, Command, Form, Input, ScrollArea } from 'erxes-ui';
import { useEffect, useState } from 'react';
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
    if (userNotificationSettings) {
      form.reset({
        all: {
          inAppNotificationsDisabled:
            userNotificationSettings.inAppNotificationsDisabled || false,
          emailNotificationsDisabled:
            userNotificationSettings.emailNotificationsDisabled || false,
        },
        expiresAfterDays: 30,
        plugins: userNotificationSettings.plugins || {},
      });
    }
  }, [userNotificationSettings]);

  return (
    <div className="h-screen w-full flex flex-col">
      <SettingsHeader
        breadcrumbs={
          <Button variant="ghost" className="font-semibold">
            <IconBellRinging className="w-4 h-4 text-accent-foreground" />
            Notification Settings
          </Button>
        }
      />

      <NotificationSettingsProvider
        form={form}
        loading={loading || userNotificationSettingsLoading}
        pluginsNotifications={pluginsNotifications}
        isOrgDefault={!!isOrgDefault}
        toggleOrgDefault={toggleOrgDefault}
        onNotiTypeChecked={onNotiTypeChecked}
      >
        <Form {...form}>
          <NotificationSettingsContentWrapper
            isDisabledAllNotification={isDisabledAllNotification}
          />
        </Form>
      </NotificationSettingsProvider>
    </div>
  );
};

const NotificationSettingsContentWrapper = ({
  isDisabledAllNotification,
}: {
  isDisabledAllNotification: boolean;
}) => {
  const { loading, filteredPlugins, search, setSearch } =
    useNotificationContent();

  if (loading) {
    return <NotificationSettingsSkeleton />;
  }

  return (
    <form className="flex flex-col flex-1">
      <GeneralNotificationSettings />
      <BlurWrapper isDisabled={isDisabledAllNotification}>
        <div className="mx-auto max-w-3xl">
          <div className="w-full flex justify-end mb-6">
            <Input
              variant="secondary"
              className="w-48 bg-background border-b"
              placeholder="Search .."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filteredPlugins.map(({ pluginName, modules }) => (
            <PluginNotificationContent
              key={pluginName}
              pluginName={pluginName}
              modules={modules}
            />
          ))}
        </div>
      </BlurWrapper>
    </form>
  );
};
