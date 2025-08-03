import { z } from 'zod';

const USER_DETAIL_SCHEMA = z.object({
  email: z
    .string({ required_error: 'Required field' })
    .email({
      message: 'Please fill a valid email address',
    })
    .default(''),
  username: z
    .string({ required_error: 'Username required' })
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, hyphens, and underscores',
    ),
  employeeId: z.string().optional().nullable(),
  details: z.object({
    firstName: z.string(),
    lastName: z.string().optional().nullable(),
    middleName: z.string().optional().nullable(),
    shortName: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    birthDate: z.any().optional().nullable(),
    location: z.any().optional().nullable(),
    workStartedDate: z.any().optional().nullable(),
  }),
  positionIds: z.string().array().optional(),
  links: z.any().optional().nullable(),
  branchIds: z.string().array().optional(),
  departmentIds: z.string().array().optional(),
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
