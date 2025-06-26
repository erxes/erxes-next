import { z } from 'zod';

export const CALL_INTEGRATION_ADD_SCHEMA = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().min(1),
  websocketServer: z.string().min(1),
  queues: z.string().min(1),
  operators: z.array(
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
      isForwarding: z.boolean(),
    }),
  ),
  brandId: z.string().min(1),
  channelId: z.string().min(1),
});
