import { z } from 'zod';

export const teacherFormSchema = z.object({
  userIds: z.array(z.string()),
});

export type TeacherFormType = z.infer<typeof teacherFormSchema>;
