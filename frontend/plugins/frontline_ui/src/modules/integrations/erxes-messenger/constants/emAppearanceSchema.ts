import { z } from 'zod';

export const EMAPEARANCE_SCHEMA = z.object({
  brandColor: z.string().optional(),
  logo: z.string().optional(),
});
