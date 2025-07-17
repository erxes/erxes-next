import { NotifTypeRow } from '@/notification/settings/components/NotifTypeRow';
import { useNotificationsSettingsContext } from '@/notification/settings/context/NotificationSettingsContext';
import { Button, Form, Input, Separator } from 'erxes-ui';

export const GeneralNotificationSettings = () => {
  const { form, isOrgDefault, toggleOrgDefault, onCheckGlobal } =
    useNotificationsSettingsContext();

  return (
    <div className="w-full mx-auto max-w-3xl my-8">
      <div className="flex justify-between items-center my-4">
        <div>
          <h2 className="font-semibold text-lg">
            {isOrgDefault ? 'Organization' : 'My'} Notification Settings
          </h2>
          <span className="text-accent-foreground text-xs ">
            Select push and email notifications you'd like to receive{' '}
          </span>
        </div>
        <Button variant="link" onClick={() => toggleOrgDefault(!isOrgDefault)}>
          Edit {isOrgDefault ? 'my' : 'organization'} default notifications
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
      <Form.Field
        control={form.control}
        name="expiresAfterDays"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Notification expires after days</Form.Label>
            <Input {...field} type="number" />
          </Form.Item>
        )}
      />
    </div>
  );
};
