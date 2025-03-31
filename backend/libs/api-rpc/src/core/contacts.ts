import { initTRPC } from '@trpc/server';

import { z } from 'zod';

const t = initTRPC.create();

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

const stringMapSchema = z.record(z.string());

export const customerTRPCSchema = z.object({
  state: z.enum(['visitor', 'lead', 'customer']).optional(),

  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  birthDate: z.coerce.date().optional(), // Date төрөл
  sex: z.number().optional(),
  primaryEmail: z.string().email().optional(),
  emails: z.array(z.string()).optional(),
  avatar: z.string().optional(),
  primaryPhone: z.string().optional(),
  phones: z.array(z.string()).optional(),
  primaryAddress: addressSchema.optional(),
  addresses: z.array(addressSchema).optional(),

  description: z.string().optional(),
  doNotDisturb: z.string().optional(),
  isSubscribed: z.string().optional(),
  emailValidationStatus: z.string().optional(),
  phoneValidationStatus: z.string().optional(),
  links: stringMapSchema.optional(),
  status: z.string().optional(),
  code: z.string().optional(),
});

export const customerDocumentTRPCSchema = customerTRPCSchema.extend({
  _id: z.string(),
  createdAt: z.coerce.date().optional(),
  modifiedAt: z.coerce.date().optional(),
});

export const contactRouter = t.router({
  customer: t.router({
    list: t.procedure
      .input(customerTRPCSchema)
      .output(z.union([z.array(customerDocumentTRPCSchema), z.null()]))
      .query(async () => {
        return null;
      }),

    get: t.procedure
      .output(z.union([customerDocumentTRPCSchema, z.null()]))
      .query(async () => {
        return null;
      }),

    create: t.procedure
      .input(customerTRPCSchema)
      .output(z.union([customerDocumentTRPCSchema, z.null()]))
      .mutation(async () => {
        return null;
      }),

    update: t.procedure
      .input(customerDocumentTRPCSchema)
      .output(z.union([z.array(customerDocumentTRPCSchema), z.null()]))
      .mutation(async () => {
        return null;
      }),

    delete: t.procedure
      .input(customerDocumentTRPCSchema)
      .output(z.union([z.array(customerDocumentTRPCSchema), z.null()]))
      .mutation(async () => {
        return null;
      }),
  }),
});
