import { z } from 'zod';

export const EMAPPEARANCE_SCHEMA = z.object({
  logo: z.string().optional(),
  primary: z
    .object({
      DEFAULT: z.string().optional(),
      foreground: z.string().optional(),
    })
    .optional(),
});
