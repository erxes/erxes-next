import { z } from 'zod';

export const CREATE_TOKEN_SCHEMA = z
  .object({
    name: z.string(),
    userGroupId: z.string().optional(),
    expireDate: z.date().optional(),
    allowAllPermission: z.boolean().default(false),
    noExpire: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.allowAllPermission && !data.userGroupId) {
      ctx.addIssue({
        code: 'custom',
        message: 'userGroupId is required when allowAllPermission is false',
        path: ['userGroupId'],
      });
    }

    if (!data.noExpire && !data.expireDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'expireDate is required when noExpire is false',
        path: ['expireDate'],
      });
    }
  });
