import { z } from 'zod';

export const mainSettingsSchema = z.object({
  MainCurrency: z.string().min(1),
  HasVat: z.boolean(),
  VatAccountPayable: z.string().optional(),
  VatAccountReceivable: z.string().optional(),
  VatAfterAccountPayable: z.string().optional(),
  VatAfterAccountReceivable: z.string().optional(),
  HasCtax: z.boolean(),
  CtaxAccountPayable: z.string().optional(),
});

export type TMainSettings = z.infer<typeof mainSettingsSchema>;
