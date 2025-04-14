import { initTRPC } from '@trpc/server';

import { customerRouter } from '@/contacts/trpc/customer';
import { companyTrpcRouter } from '@/contacts/trpc/company';

const t = initTRPC.create();

export const contactRouter = t.mergeRouters(customerRouter, companyTrpcRouter);
