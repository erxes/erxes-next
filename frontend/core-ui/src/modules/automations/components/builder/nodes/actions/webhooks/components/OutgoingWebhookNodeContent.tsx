import { TOutgoingWebhookForm } from '@/automations/components/builder/nodes/actions/webhooks/states/outgoingWebhookFormSchema';
import { MetaFieldLine } from '@/automations/components/builder/nodes/MetaFieldLine';
import { CoreActionNodeConfigProps } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';

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
