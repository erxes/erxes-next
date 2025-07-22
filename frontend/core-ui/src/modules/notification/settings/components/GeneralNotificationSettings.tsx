import { NotifTypeRow } from '@/notification/settings/components/NotifTypeRow';
import { useNotificationsSettingsContext } from '@/notification/settings/context/NotificationSettingsContext';
import { Button, Form, Input, Separator } from 'erxes-ui';

export const GeneralNotificationSettings = () => {
  const { form, isOrgConfig, toggleOrgConfig, onCheckGlobal } =
    useNotificationsSettingsContext();

  const expiresAfterDays = form.watch('expiresAfterDays');

  return (
    <div className="w-full mx-auto max-w-3xl my-8">
      <div className="flex justify-between items-center my-4">
        <div>
          <h2 className="font-semibold text-lg">
            {isOrgConfig ? 'Organization' : 'My'} Notification Settings
            {!isOrgConfig && (
              <Button variant="link" className="ml-4">
                Set a default
              </Button>
            )}
          </h2>
          <span className="text-accent-foreground text-xs ">
            Select push and email notifications you'd like to receive
          </span>
        </div>
        <Button variant="link" onClick={() => toggleOrgConfig(!isOrgConfig)}>
          Edit {isOrgConfig ? 'my' : 'organization'} default notifications
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
      {isOrgConfig && (
        <Form.Field
          key={expiresAfterDays}
          control={form.control}
          name="expiresAfterDays"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Notification expires after days</Form.Label>
              <Input {...field} type="number" />
            </Form.Item>
          )}
        />
      )}
    </div>
  );
};
