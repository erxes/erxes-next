import { z } from 'zod';

export const EMINTRO_SCHEMA = z.object({
  welcomeMessage: z.string().optional(),
  awayMessage: z.string().optional(),
  thankyouMessage: z.string().optional(),
});
