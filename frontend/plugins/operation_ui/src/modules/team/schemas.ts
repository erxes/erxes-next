import { z } from 'zod';

export const TEAM_FORM_SCHEMA = z.object({
  name: z.string(),
  icon: z.string(),
  description: z.string().optional(),
  memberIds: z.string().array().optional(),
});

export const TEAM_MEMBER_FORM_SCHEMA = z.object({
  memberIds: z.string().array().optional(),
});
