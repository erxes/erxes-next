import { initTRPC } from '@trpc/server';

import { contactRouter } from '~/modules/contacts/trpc';

export const createContext = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) => {
  //   const subdomain = req.headers['x-subdomain'] as string;

  return {
    subdomain: '123123',
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const appRouter = t.mergeRouters(contactRouter);
