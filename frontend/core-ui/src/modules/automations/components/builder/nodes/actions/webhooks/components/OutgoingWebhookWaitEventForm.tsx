import { NodeContentComponentProps } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';
import { TOutgoingWebhookForm } from '../states/outgoingWebhookFormSchema';

const EVENT_TYPES = [
  { type: 'trigger', label: 'Trigger event' },
  { type: 'action', label: 'Action target event' },
  { type: 'custom', label: 'API request' },
];

export const OutgoingWebhookWaitEventForm = ({
  config,
}: NodeContentComponentProps<TOutgoingWebhookForm>) => {
  // const {} =
  return (
    <div>
      <h3>Webhook Wait Event Configuration</h3>
      <p>URL</p>
      <p>Method</p>
      {/* Add your wait event form logic here */}
    </div>
  );
};
