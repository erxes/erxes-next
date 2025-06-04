import { z } from 'zod';

export const courseCategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  code: z.string(),
  description: z.string(),
  parentId: z.string().optional(),
});

export type CourseCategoryFormType = z.infer<typeof courseCategoryFormSchema>;
