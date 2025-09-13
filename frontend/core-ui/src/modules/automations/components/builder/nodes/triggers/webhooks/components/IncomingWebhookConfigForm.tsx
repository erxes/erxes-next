import { AUTOMATION_INCOMING_WEBHOOK_API_METHODS } from '@/automations/components/builder/nodes/triggers/webhooks/constants/incomingWebhook';
import {
  incomingWebhookFormSchema,
  TIncomingWebhookForm,
} from '@/automations/components/builder/nodes/triggers/webhooks/states/automationIncomingWebhookFormDefinition';
import { AutomationTriggerSidebarCoreFormProps } from '@/automations/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconChevronDown,
  IconCopy,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import {
  Button,
  Collapsible,
  Form,
  Input,
  Label,
  Select,
  toast,
} from 'erxes-ui';
import { useImperativeHandle } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export const IncomingWebhookConfigForm = ({
  formRef,
  handleSave,
  activeNode,
}: AutomationTriggerSidebarCoreFormProps) => {
  const form = useForm<TIncomingWebhookForm>({
    resolver: zodResolver(incomingWebhookFormSchema),
    defaultValues: {
      ...(activeNode?.config || {}),
    },
  });

  useImperativeHandle(formRef, () => ({
    submit: () => {
      console.log({ daczxc: 'Ds' });
      form.handleSubmit(handleSave, (error) => {
        console.log({ error });
        toast({
          title: 'There is some error in the form',
          variant: 'destructive',
        });
      })();
    },
  }));

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-row items-end gap-2">
          <Form.Field
            control={form.control}
            name="method"
            render={({ field }) => (
              <Form.Item className="w-1/6">
                <Form.Label>Method</Form.Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {AUTOMATION_INCOMING_WEBHOOK_API_METHODS.map((method) => {
                      return (
                        <Select.Item key={method} value={method}>
                          {method}
                        </Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select>
              </Form.Item>
            )}
          />
          <Form.Item className="w-2/6">
            <Form.Label>URL</Form.Label>

            <Input disabled value="https://api.yourapp.com/webhooks/" />
          </Form.Item>

          <Form.Field
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <Form.Item className="w-3/6">
                <Form.Label>Endpoint</Form.Label>

                <Input {...field} />
              </Form.Item>
            )}
          />
          <Button variant="secondary">
            <IconCopy />
          </Button>
        </div>
        <Form.Field
          control={form.control}
          name="headers"
          render={({ field }) => {
            return (
              <Form.Item>
                <IncomingWebhookHeadersBuider
                  headers={field.value}
                  onChange={field.onChange}
                />
              </Form.Item>
            );
          }}
        />
        <Collapsible>
          <Collapsible.Trigger asChild>
            <Button variant="secondary" className="flex justify-self-center">
              <Label>Advanced Settings</Label>
              <IconChevronDown />
            </Button>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <div>
              <Form.Field
                control={form.control}
                name="maxRetries"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Max Retries</Form.Label>
                    <Input {...field} type="number" defaultValue={3} />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="maxRetries"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Timeout (seconds)</Form.Label>
                    <Input {...field} type="number" defaultValue={30} />
                  </Form.Item>
                )}
              />
            </div>
          </Collapsible.Content>
        </Collapsible>
      </div>
    </FormProvider>
  );
};

const IncomingWebhookHeadersBuider = ({
  headers = [],
  onChange,
}: {
  headers: TIncomingWebhookForm['headers'];
  onChange: (...event: any[]) => void;
}) => {
  const handleChange = (
    index: number,
    field: 'key' | 'value' | 'description',
    value: string,
  ) => {
    const updatedHeaders = [...(headers || [])];
    updatedHeaders[index] = {
      ...updatedHeaders[index],
      [field]: value,
    };
    onChange(updatedHeaders);
  };

  const handleRemove = (index: number) => {
    const updatedHeaders = (headers || []).filter((_, i) => i !== index);
    onChange(updatedHeaders);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <Form.Label>Headers</Form.Label>
        <Button
          onClick={() =>
            onChange([
              ...(headers || []),
              { key: '', value: '', description: '' },
            ])
          }
        >
          <IconPlus /> Add Header
        </Button>
      </div>
      <div>
        <Form.Label className="w-1/4">Key</Form.Label>
        <Form.Label className="w-2/4">Value</Form.Label>
        <Form.Label className="w-1/4">Description</Form.Label>
      </div>
      {headers.map(({ key, value, description }, index) => (
        <div key={index} className="flex flex-row items-center gap-2">
          <Input
            value={key}
            placeholder="Key"
            className="w-1/4"
            onChange={(e) => handleChange(index, 'key', e.target.value)}
          />
          <Input
            value={value}
            placeholder="Value"
            className="w-2/4"
            onChange={(e) => handleChange(index, 'value', e.target.value)}
          />
          <Input
            value={description}
            placeholder="Description"
            className="w-1/4"
            onChange={(e) => handleChange(index, 'description', e.target.value)}
          />
          <Button variant="secondary" onClick={() => handleRemove(index)}>
            <IconTrash />
          </Button>
        </div>
      ))}
    </>
  );
};
