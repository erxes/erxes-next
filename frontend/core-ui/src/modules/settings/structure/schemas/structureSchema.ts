import { z } from 'zod';

export const STRUCTURE_DETAILS_SCHEMA = z.object({
  _id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  code: z.string(),
  coordinate: z
    .object({
      latitude: z.string(),
      longitude: z.string(),
    })
    .optional(),
  email: z.string().email(),
  image: z
    .object({
      name: z.string(),
      url: z.string().url(),
      type: z.string(),
    })
    .optional(),
  phoneNumber: z.string(),
  supervisor: z
    .object({
      email: z.string().email(),
      details: z.object({
        firstName: z.string(),
        lastName: z.string(),
        fullName: z.string(),
        operatorPhone: z.string(),
        position: z.string(),
        shortName: z.string(),
        avatar: z.string().url(),
        description: z.string(),
      }),
    })
    .optional(),
  supervisorId: z.string(),
});
