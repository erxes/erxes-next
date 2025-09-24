import { z } from 'zod';

const managePropertyRuleSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  operator: z.string().min(1, 'Operator is required'),
  // Accept any value type to allow placeholders and templating
  value: z.any().optional(),
});

export const managePropertiesFormSchema = z.object({
  module: z.string().optional(),
  rules: z.array(managePropertyRuleSchema).default([]),
});

export type TManagePropertiesForm = z.infer<typeof managePropertiesFormSchema>;
