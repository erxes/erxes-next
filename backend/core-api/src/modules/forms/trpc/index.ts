import { initTRPC } from '@trpc/server';
import { fieldsRouter } from './fields';

const t = initTRPC.create();

export const formsRouter = t.mergeRouters(fieldsRouter);
