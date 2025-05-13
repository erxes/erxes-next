import { z } from 'zod';

export const classFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  location: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

export type ClassFormType = z.infer<typeof classFormSchema>;
