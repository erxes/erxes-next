import { ModuleNotificationContent } from '@/notification/settings/components/ModuleNotificationContent';
import { TNotificationSettingsForm } from '@/notification/settings/states/notificationSettingsForm';
import { PluginNotificationSettingsProps } from '@/notification/settings/types/notificationSettings';
import { IconChevronDown } from '@tabler/icons-react';
import { Card, cn, Collapsible, Form, Separator } from 'erxes-ui';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const PluginNotificationContent = ({
  pluginName,
  modules,
}: PluginNotificationSettingsProps) => {
  const { control } = useFormContext<TNotificationSettingsForm>();

  const [open, setOpen] = useState(true);

  return (
    <Card key={pluginName} className="mb-4">
      <Collapsible
        key={pluginName}
        open={open}
        onOpenChange={setOpen}
        className="p-4"
      >
        <Collapsible.Trigger asChild>
          <h3 className="flex flex-row items-center justify-between text-bold capitalize cursor-pointer">
            {pluginName}
            <IconChevronDown
              className={cn(
                'size-4 transform transition-transform duration-100',
                open ? 'rotate-0' : '-rotate-90',
              )}
            />
          </h3>
        </Collapsible.Trigger>
        <Collapsible.Content className="mt-2 py-2">
          {open && (
            <>
              <Separator />
              <Form.Field
                control={control}
                name="plugins"
                render={({ field }) => {
                  const pluginConfigState = field.value[pluginName] || {};

                  return (
                    <Form.Item>
                      {modules.map(
                        (
                          {
                            name: moduleName,
                            description,
                            icon: iconName,
                            types,
                          },
                          index,
                        ) => (
                          <div key={moduleName}>
                            <ModuleNotificationContent
                              pluginName={pluginName}
                              pluginConfigState={pluginConfigState}
                              moduleName={moduleName}
                              iconName={iconName}
                              description={description}
                              types={types}
                            />
                            {modules.length !== index + 1 && <Separator />}
                          </div>
                        ),
                      )}
                    </Form.Item>
                  );
                }}
              />
            </>
          )}
        </Collapsible.Content>
      </Collapsible>
    </Card>
  );
};
