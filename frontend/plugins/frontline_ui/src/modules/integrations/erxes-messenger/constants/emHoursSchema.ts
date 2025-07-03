import { z } from 'zod';
import { Weekday } from '@/integrations/erxes-messenger/types/Weekday';

export const onlineHoursSchema = z.object({
  work: z.boolean().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const EMHOURS_SCHEMA = z.object({
  availabilitySwitchType: z.enum(['manual', 'schedule']),
  onlineHours: z.record(z.nativeEnum(Weekday), onlineHoursSchema),
});
