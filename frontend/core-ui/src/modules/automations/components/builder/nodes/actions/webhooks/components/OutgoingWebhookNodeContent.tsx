import { CoreActionNodeConfigProps } from '@/automations/components/builder/nodes/actions/coreAutomationActions';
import { TOutgoingWebhookForm } from '@/automations/components/builder/nodes/actions/webhooks/states/outgoingWebhookFormSchema';
import { MetaFieldLine } from '@/automations/components/builder/nodes/MetaFieldLine';

export const OutgoingWebhookNodeContent = ({
  config,
}: CoreActionNodeConfigProps<TOutgoingWebhookForm>) => {
  const { url, method } = config || {};
  return (
    <>
      <MetaFieldLine fieldName="URL" content={`${method}: ${url}`} />
    </>
  );
};
