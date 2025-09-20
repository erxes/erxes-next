import { AUTOMATION_INCOMING_WEBHOOK_API_METHODS } from '@/automations/components/builder/nodes/triggers/webhooks/constants/incomingWebhook';
import { z } from 'zod';

const incomingWebhookHeadersSchema = z.object({
  key: z.string(),
  value: z.string(),
  description: z.string(),
});

export interface PropertySchema {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  isExpanded?: boolean;
  children?: PropertySchema[];
  arrayItemType?: 'string' | 'number' | 'boolean' | 'object';
  arrayItemSchema?: PropertySchema[];
}

export const incomingWebhookFormSchema = z.object({
  endpoint: z.string(),
  method: z
    .enum(AUTOMATION_INCOMING_WEBHOOK_API_METHODS as [string, ...string[]])
    .default('GET'),
  headers: z.array(incomingWebhookHeadersSchema),
  // Accept any JSON schema structure for builder compatibility
  schema: z.any(),
  isEnabledSecurity: z.string().optional(),
  security: z
    .object({
      beararToken: z.string(),
    })
    .optional(),
  timeoutMs: z.string().optional(),
  maxRetries: z.string().optional(),
});

export type TIncomingWebhookForm = z.infer<typeof incomingWebhookFormSchema>;
