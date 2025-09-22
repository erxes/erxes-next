import { TAutomationActionConfigField } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { Form } from 'erxes-ui';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { IncomingWebhookConfigForm } from '@/automations/components/builder/nodes/triggers/webhooks/components/IncomingWebhookConfigForm';

export function WaitEventConfigCustomForm({
  configFieldName,
}: {
  configFieldName: TAutomationActionConfigField;
}) {
  const { control } = useFormContext<TAutomationBuilderForm>();
  const formRef = useRef<{ submit: () => void }>(null);

  return (
    <Form.Field
      name={`${configFieldName}.config`}
      control={control}
      render={({ field }) => (
        <Form.Item className="flex-1">
          <Form.Label>Conditions</Form.Label>
          <IncomingWebhookConfigForm
            formRef={formRef}
            activeNode={{ config: field.value } as any}
            handleSave={(config) =>
              field.onChange({ ...(field.value || {}), ...(config || {}) })
            }
          />
        </Form.Item>
      )}
    />
  );
}
