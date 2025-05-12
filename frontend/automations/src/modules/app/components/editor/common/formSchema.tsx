import { z } from 'zod';

const formSchema = z.object({
  isMinimized: z.boolean(),
  name: z.string().min(1),
  activeTab: z.string().min(1),
  activeNode: z.any(),
});

export default formSchema;
