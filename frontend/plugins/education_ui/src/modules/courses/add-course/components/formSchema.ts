import { z } from 'zod';

export const courseFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  type: z.string().min(1, 'Please select a type'),
  description: z.string().optional(),
  unitPrice: z.number({
    required_error: 'Unit price is required',
  }),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(50, 'Code must be less than 50 characters'),
});

export type CourseFormType = z.infer<typeof courseFormSchema>;
