import { LabeledSeparator } from '@/automations/components/builder/nodes/actions/webhooks/components/LabeledSeparator';
import { TOutgoingWebhookForm } from '@/automations/components/builder/nodes/actions/webhooks/states/outgoingWebhookFormSchema';
import { Form, Input, Select, Switch } from 'erxes-ui';
import { useFormContext } from 'react-hook-form';

export const OutgoingWebhookOptions = () => {
  const { control } = useFormContext<TOutgoingWebhookForm>();

  return (
    <div className="flex flex-col gap-6">
      <Form.Field
        control={control}
        name="options.ignoreSSL"
        render={({ field }) => (
          <Form.Item className="flex flex-row justify-between">
            <div>
              <Form.Label>Enable SSL certificate verification </Form.Label>
              <Form.Description>
                Verify SSL certificates when sending a request. Verification
                failures will result in the request being aborted.{' '}
              </Form.Description>
            </div>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="options.timeout"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Timeout (ms)</Form.Label>

            <Input {...field} />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="options.followRedirect"
        render={({ field }) => (
          <Form.Item className="flex flex-row justify-between">
            <div>
              <Form.Label>Automatically follow redirects </Form.Label>
              <Form.Description>
                Follow HTTP 3xx responses as redirects.
              </Form.Description>
            </div>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="options.followRedirect"
        render={({ field: { value: isChecked } }) =>
          isChecked ? (
            <Form.Field
              control={control}
              name="options.maxRedirects"
              render={({ field }) => (
                <Form.Item>
                  <div>
                    <Form.Label>Maximum number of redirects</Form.Label>
                    <Form.Description>
                      Set a cap on the maximum number of redirects to follow.
                    </Form.Description>
                  </div>
                  <Input {...field} />
                </Form.Item>
              )}
            />
          ) : (
            <></>
          )
        }
      />

      <LabeledSeparator>Retry Configuration</LabeledSeparator>

      <Form.Field
        control={control}
        name="options.retry.attempts"
        render={({ field }) => (
          <Form.Item className="space-y-2">
            <Form.Label>Retry Attempts</Form.Label>
            <Input {...field} type="number" defaultValue="0" min="0" max="10" />
            <Form.Description>
              Number of retry attempts (0 = no retry)
            </Form.Description>
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="options.retry.delay"
        render={({ field }) => (
          <Form.Item className="space-y-2">
            <Form.Label>Retry Delay (ms)</Form.Label>
            <Input
              {...field}
              type="number"
              defaultValue="1000"
              min="100"
              max="60000"
            />
            <Form.Description className="text-xs text-gray-500">
              Delay between retry attempts
            </Form.Description>
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="options.retry.backoff"
        render={({ field }) => (
          <Form.Item className="space-y-2">
            <Form.Label>Backoff Strategy</Form.Label>
            <Select defaultValue="none">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="none">None</Select.Item>
                <Select.Item value="linear">Linear</Select.Item>
                <Select.Item value="exponential">Exponential</Select.Item>
              </Select.Content>
            </Select>
          </Form.Item>
        )}
      />
      <LabeledSeparator>Proxy Configuration</LabeledSeparator>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Form.Field
            control={control}
            name="options.proxy.host"
            render={({ field }) => (
              <Form.Item className="space-y-2">
                <Form.Label>Proxy Host</Form.Label>
                <Input {...field} placeholder="proxy.example.com" />
              </Form.Item>
            )}
          />
          <Form.Field
            control={control}
            name="options.proxy.port"
            render={({ field }) => (
              <Form.Item className="space-y-2">
                <Form.Label>Proxy Port</Form.Label>
                <Input {...field} type="number" placeholder="8080" />
              </Form.Item>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Field
            control={control}
            name="options.proxy.auth.username"
            render={({ field }) => (
              <Form.Item className="space-y-2">
                <Form.Label>Proxy Username</Form.Label>
                <Input {...field} placeholder="Optional" />
              </Form.Item>
            )}
          />
          <Form.Field
            control={control}
            name="options.proxy.auth.password"
            render={({ field }) => (
              <Form.Item className="space-y-2">
                <Form.Label>Proxy Password</Form.Label>
                <Input {...field} placeholder="Optional" />
              </Form.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};
