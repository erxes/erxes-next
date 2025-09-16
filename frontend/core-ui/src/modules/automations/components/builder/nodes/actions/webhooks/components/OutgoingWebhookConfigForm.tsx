import { OutgoingWebhookAuth } from '@/automations/components/builder/nodes/actions/webhooks/components/OutgoingWebhookAuth';
import { OutgoingWebhookBody } from '@/automations/components/builder/nodes/actions/webhooks/components/OutgoingWebhookBody';
import { OutgoingWebhookHeaders } from '@/automations/components/builder/nodes/actions/webhooks/components/OutgoingWebhookHeaders';
import { OutgoingWebhookOptions } from '@/automations/components/builder/nodes/actions/webhooks/components/OutgoingWebhookOptions';
import { OutgoingWebhookRequest } from '@/automations/components/builder/nodes/actions/webhooks/components/OutgoingWebhookRequest';
import { outgoingWebhookFormSchema } from '@/automations/components/builder/nodes/actions/webhooks/states/outgoingWebhookFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs } from 'erxes-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { TOutgoingWebhookForm } from '@/automations/components/builder/nodes/actions/webhooks/states/outgoingWebhookFormSchema';

export const OutgoingWebhookConfigForm = () => {
  const form = useForm<TOutgoingWebhookForm>({
    resolver: zodResolver(outgoingWebhookFormSchema),
    defaultValues: {
      method: 'POST',
      url: '',
      queryParams: [],
      body: {},
      auth: { type: 'none' } as any,
      headers: [],
      options: {
        followRedirect: true,
        retry: { attempts: 0, delay: 1000, backoff: 'none' },
        keepAlive: true,
      },
    },
  });

  return (
    <div className="w-[650px] h-full">
      <Tabs defaultValue="request">
        <Tabs.List className="w-full" defaultValue="request">
          <Tabs.Trigger className="w-1/5" value="request">
            Request
          </Tabs.Trigger>
          <Tabs.Trigger className="w-1/5" value="body">
            Body
          </Tabs.Trigger>

          <Tabs.Trigger className="w-1/5" value="auth">
            Auth
          </Tabs.Trigger>
          <Tabs.Trigger className="w-1/5" value="header">
            Headers
          </Tabs.Trigger>

          <Tabs.Trigger className="w-1/5" value="options">
            Options
          </Tabs.Trigger>
        </Tabs.List>
        <FormProvider {...form}>
          <div className="p-6">
            <Tabs.Content value="request">
              <OutgoingWebhookRequest />
            </Tabs.Content>
            <Tabs.Content value="body">
              <OutgoingWebhookBody />
            </Tabs.Content>

            <Tabs.Content value="auth">
              <OutgoingWebhookAuth />
            </Tabs.Content>
            <Tabs.Content value="header">
              <OutgoingWebhookHeaders />
            </Tabs.Content>

            <Tabs.Content value="options">
              <OutgoingWebhookOptions />
            </Tabs.Content>
          </div>
        </FormProvider>
      </Tabs>
    </div>
  );
};
