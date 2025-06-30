import { useAtom } from 'jotai';
import { callAddSheetAtom } from '../states/callAddSheetAtom';
import { Button, Checkbox, Form, Input, Sheet } from 'erxes-ui';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CALL_INTEGRATION_ADD_SCHEMA } from '@/integrations/call/constants/callIntegrationAddSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectBrand } from 'ui-modules';
import { SelectChannel } from '@/inbox/channel/components/SelectChannel';

export const CallAddSheet = () => {
  const [callAddSheet, setCallAddSheet] = useAtom(callAddSheetAtom);

  return (
    <Sheet open={callAddSheet} onOpenChange={setCallAddSheet}>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add Call
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="sm:max-w-3xl">
        <CallAdd />
      </Sheet.View>
    </Sheet>
  );
};

export const CallAddLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions: React.ReactNode;
}) => {
  return (
    <>
      <Sheet.Header>
        <Sheet.Title>Add Call</Sheet.Title>
        <Sheet.Close />
      </Sheet.Header>
      <Sheet.Content className="overflow-auto p-4 styled-scroll">
        <div className="grid grid-cols-2 gap-4">{children}</div>
      </Sheet.Content>
      <Sheet.Footer>
        <Sheet.Close asChild>
          <Button className="mr-auto text-muted-foreground" variant="ghost">
            Cancel
          </Button>
        </Sheet.Close>
        {actions}
      </Sheet.Footer>
    </>
  );
};

export const CallAdd = () => {
  const form = useForm<z.infer<typeof CALL_INTEGRATION_ADD_SCHEMA>>({
    resolver: zodResolver(CALL_INTEGRATION_ADD_SCHEMA),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'operators',
  });

  const onSubmit = (data: z.infer<typeof CALL_INTEGRATION_ADD_SCHEMA>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-auto overflow-hidden"
      >
        <CallAddLayout
          actions={
            <Button type="submit" onClick={() => form.handleSubmit(onSubmit)}>
              Save
            </Button>
          }
        >
          <Form.Field
            name="name"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Name</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            name="phoneNumber"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            name="websocketServer"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>WebSocket Server</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            name="queues"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Queues</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            name="brandId"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Select brand</Form.Label>
                <SelectBrand.FormItem
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                />
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            name="channelId"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Select channel</Form.Label>
                <SelectChannel.FormItem
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                />
                <Form.Message />
              </Form.Item>
            )}
          />
          <div className="font-medium">Operators</div>
          {fields.map((field, index) => (
            <div
              className="col-span-2 border-b last-of-type:border-b-0 border-dashed pb-4 last-of-type:pb-0"
              key={field.id}
            >
              <div className="flex gap-4 w-full">
                <Form.Field
                  name={`operators.${index}.username`}
                  render={({ field }) => (
                    <Form.Item className="flex-auto">
                      <Form.Label>Username</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  name={`operators.${index}.password`}
                  render={({ field }) => (
                    <Form.Item className="flex-auto">
                      <Form.Label>Password</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-destructive/20 text-destructive mt-6 size-8 hover:bg-destructive/30"
                  onClick={() => remove(index)}
                >
                  <IconTrash />
                </Button>
              </div>
              <Form.Field
                name={`operators.${index}.isForwarding`}
                render={({ field }) => (
                  <Form.Item className="mt-4">
                    <div className="flex gap-2 items-center">
                      <Form.Control>
                        <Checkbox {...field} />
                      </Form.Control>
                      <Form.Label>Is Forwarding</Form.Label>
                    </div>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
          ))}
          <Button
            className="col-span-2"
            variant="secondary"
            onClick={() =>
              append({
                username: '',
                password: '',
                isForwarding: false,
              })
            }
          >
            <IconPlus />
            Add Operator
          </Button>
        </CallAddLayout>
      </form>
    </Form>
  );
};
