import { z } from 'zod';

const USER_DETAIL_SCHEMA = z.object({
  email: z
    .string({ required_error: 'Required field' })
    .email({
      message: 'Please fill a valid email address',
    })
    .default(''),
  groupId: z.string({ required_error: 'Required field' }),
  channelIds: z.string().array().optional(),
  unitId: z.string().optional(),
  departmentId: z.string().optional(),
  branchId: z.string().optional(),
  details: z.any(),
  links: z.any().optional(),
  groupIds: z.string().array().optional(),
  brandIds: z.string().array().optional(),
});

const USER_SUBMIT_SCHEMA = z.object({
  entries: z
    .object({
      email: z
        .string({ required_error: 'Required field' })
        .email({
          message: 'Please fill a valid email address',
        })
        .default(''),
      password: z
        .string({ required_error: 'Required field' })
        .min(8, 'Password must be at least 8 characters long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
          message:
            'Must contain at least one uppercase letter, one lowercase letter, and one number',
        })
        .default(''),
      groupId: z.string({ required_error: 'Required field' }),
      channelIds: z.string().array().optional(),
      unitId: z.string().optional(),
      departmentId: z.string().optional(),
      branchId: z.string().optional(),
    })
    .array(),
});

export { USER_SUBMIT_SCHEMA, USER_DETAIL_SCHEMA };
