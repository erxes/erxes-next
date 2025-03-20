import { z } from 'zod';

export const mainSettingsSchema = z.object({
  mainCurrency: z.string().min(1),
  hasVat: z.boolean(),
  vatAccountPayable: z.string().optional(),
  vatAccountReceivable: z.string().optional(),
  vatAfterAccountPayable: z.string().optional(),
  vatAfterAccountReceivable: z.string().optional(),
  hasCtax: z.boolean(),
  ctaxAccountPayable: z.string().optional(),
});

export type TMainSettings = z.infer<typeof mainSettingsSchema>;
