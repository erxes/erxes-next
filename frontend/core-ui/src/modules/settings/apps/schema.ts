import { z } from 'zod';

export const CREATE_TOKEN_SCHEMA = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be ≤ 100 chars'),
  userGroupId: z.string().trim().optional(),
  expireDate: z.coerce.date().optional(),
  allowAllPermission: z.boolean().default(false),
  noExpire: z.boolean().default(false),
});
