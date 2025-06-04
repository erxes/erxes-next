import { z } from 'zod';

const DayEnum = z.enum([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]);

export const courseFormSchema = z.object({
  attachment: z.any().optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  type: z.enum(['Training', 'Event', 'Volunteering', 'Mentorship']),
  description: z.string().optional(),
  unitPrice: z.number({
    required_error: 'Unit price is required',
  }),
  ownerId: z.string().default(''),
  startDate: z.date(),
  endDate: z.date(),
  deadline: z.date(),
  categoryId: z.string({
    required_error: 'Please select a category',
  }),
  classId: z.string({
    required_error: 'Please select a class',
  }),
  dayOfWeek: z
    .array(DayEnum, { required_error: 'Please select at least one day' })
    .nonempty('Please select at least one day'),
  limit: z.number(),
  location: z.string(),
});

export type CourseFormType = z.infer<typeof courseFormSchema>;
