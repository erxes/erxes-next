import { z } from 'zod';

export const EMGREETING_SCHEMA = z.object({
  title: z.string().optional(),
  message: z.string().optional(),
  supporterUsers: z.array(z.string()).optional(),
  links: z.array(z.object({ url: z.string().url() })),
});
