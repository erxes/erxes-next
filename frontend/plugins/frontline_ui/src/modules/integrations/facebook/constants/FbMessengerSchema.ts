import { z } from 'zod';

export const FACEBOOK_MESSENGER_SCHEMA = z.object({
  name: z.string().min(1),
  brandId: z.string().min(1),
  channelId: z.string().min(1),
});
