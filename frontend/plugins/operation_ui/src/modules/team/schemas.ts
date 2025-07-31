import { z } from 'zod';

export const TEAM_FORM_SCHEMA = z.object({
  name: z.string(),
  icon: z.string(),
  description: z.string().optional(),
});
