import { z } from 'zod';

export const TmsFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().min(1, 'Color is required'),
  logo: z.string().optional(),
  favIcon: z.string().optional(),
  generalManager: z.array(z.string()).optional(),
  managers: z.array(z.string()).optional(),
  payment: z.array(z.string()).optional(),
  token: z.string().optional(),
  otherPayments: z
    .array(
      z.object({
        type: z.string().min(1, 'Type is required'),
        title: z.string().min(1, 'Title is required'),
        icon: z.string().min(1, 'Icon is required'),
        config: z.string().optional(),
      }),
    )
    .optional(),
  prepaid: z.boolean().optional(),
  prepaidAmount: z.number().min(1).max(100).optional(),
});

export type TmsFormType = z.infer<typeof TmsFormSchema>;
