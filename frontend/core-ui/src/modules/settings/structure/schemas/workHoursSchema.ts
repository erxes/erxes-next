import { z } from 'zod';
import { WorkDay } from '@/settings/structure/types/workhours';

const timeSchema = z.string().optional();

const workDaySchema = z
  .object({
    inactive: z.boolean().default(true),
    startFrom: timeSchema,
    endTo: timeSchema,
    lunchStartFrom: timeSchema,
    lunchEndTo: timeSchema,
  })
  .optional()
  .nullable();

export const workingHoursSchema = z.object(
  Object.values(WorkDay).reduce((acc, day) => {
    (acc as Record<string, any>)[day] = workDaySchema;
    return acc;
  }, {} as Record<string, any>),
);
