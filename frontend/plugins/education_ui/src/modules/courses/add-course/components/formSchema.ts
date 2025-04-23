import { z } from 'zod';

export const courseFormSchema = z.object({
  attachment: z.string().nullable().default(null),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  type: z.enum(['Training', 'Event', 'Volunteering', 'Mentorship']),
  description: z.string().optional(),
  unitPrice: z.number({
    required_error: 'Unit price is required',
  }),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(50, 'Code must be less than 50 characters'),
  ownerId: z.string().default(''),
  startDate: z.date(),
  endDate: z.date(),
  deadline: z.date(),
  categoryId: z.string({
    required_error: 'Please select a category',
  }),
});

export type CourseFormType = z.infer<typeof courseFormSchema>;
