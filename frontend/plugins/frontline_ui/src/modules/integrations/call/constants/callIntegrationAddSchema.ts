import { z } from 'zod';

export const CALL_INTEGRATION_FORM_SCHEMA = z.object({
  name: z.string().min(1),
  phone: z
    .string()
    .regex(/^[0-9]+$/)
    .min(1),
  websocketServer: z.string().min(1),
  queues: z.string().optional(),
  operators: z.array(
    z.object({
      userId: z.string().optional(),
      gsUsername: z.string().min(1),
      gsPassword: z.string().min(1),
      gsForwardAgent: z.boolean().optional(),
    }),
  ),
  brandId: z.string().min(1),
  channelIds: z.array(z.string().min(1)),
});
