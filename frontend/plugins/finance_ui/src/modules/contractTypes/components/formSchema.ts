import { z } from 'zod';

export const contractTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  code: z.string().min(1, 'Code is required.'),
  number: z.string().optional(),
  vacancy: z.number().optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  interestCalcType: z.string().optional(),
  interestRate: z.number().optional(),
  closeInterestRate: z.number().optional(),
  isAllowIncome: z.boolean().optional(),
  isDeposit: z.boolean().optional(),
  isAllowOutcome: z.boolean().optional(),
  limitPercentage: z.number().optional(),
});

export type ContractTypeFormValues = z.infer<typeof contractTypeFormSchema>;
