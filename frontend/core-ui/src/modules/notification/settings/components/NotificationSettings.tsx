import { GeneralNotificationSettings } from '@/notification/settings/components/GeneralNotificationSettings';
import { NotificationSettingsSkeleton } from '@/notification/settings/components/NotificationSettingsSkeleton';
import { OrgNotificationFormEffect } from '@/notification/settings/components/OrgNotificationFormEffect';
import { PluginNotificationContent } from '@/notification/settings/components/PluginNotificationContent';
import { UserNotificationFormEffect } from '@/notification/settings/components/UserNotificationFormEffect';
import { NotificationSettingsProvider } from '@/notification/settings/context/NotificationSettingsContext';
import { useNotificationContent } from '@/notification/settings/hooks/useNotificationContent';
import { useNotificationPluginsTypes } from '@/notification/settings/hooks/useNotificationPluginsTypes';
import { useNotificationSettings } from '@/notification/settings/hooks/useNotificationSettings';
import { IconBellRinging } from '@tabler/icons-react';
import { Button, Form, Input } from 'erxes-ui';
import { SettingsHeader } from 'ui-modules';

export const NotificationSettings = () => {
  const { pluginsNotifications, loading } = useNotificationPluginsTypes();

  const {
    isOrgConfig,
    toggleOrgConfig,
    form,
    isDisabledAllNotification,
    onNotifTypeToggle,
  } = useNotificationSettings();

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
        loading={loading}
        pluginsNotifications={pluginsNotifications}
        isOrgConfig={!!isOrgConfig}
        toggleOrgConfig={toggleOrgConfig}
        onNotifTypeToggle={onNotifTypeToggle}
        isDisabledAllNotification={isDisabledAllNotification}
      >
        <Form {...form}>
          {isOrgConfig ? (
            <OrgNotificationFormEffect form={form} />
          ) : (
            <UserNotificationFormEffect form={form} />
          )}
          <NotificationSettingsContentWrapper />
        </Form>
      </NotificationSettingsProvider>
    </div>
  );
};

const NotificationSettingsContentWrapper = () => {
  const { loading, filteredPlugins, search, setSearch } =
    useNotificationContent();

  if (loading) {
    return <NotificationSettingsSkeleton />;
  }

  return (
    <form className="flex flex-col flex-1 overflow-auto">
      <GeneralNotificationSettings />
      <div className="w-full mx-auto max-w-3xl">
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
    </form>
  );
};
