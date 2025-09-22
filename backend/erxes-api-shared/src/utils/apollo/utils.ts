import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';
import { Request as ApiRequest, Response as ApiResponse } from 'express';
import { nanoid } from 'nanoid';
import { IMainContext } from '../../core-types';
import { extractUserFromHeader, getTimezone } from '../headers';
import { getSubdomain } from '../utils';

export const generateApolloContext =
  <TContext>(
    apolloServerContext: (
      subdomain: string,
      context: IMainContext,
      req: ApiRequest,
      res: ApiResponse,
    ) => Promise<TContext>,
  ) =>
  async ({ req, res }: ExpressContextFunctionArgument) => {
    if (
      req.body.operationName === 'IntrospectionQuery' ||
      req.body.operationName === 'SubgraphIntrospectQuery'
    ) {
      return {};
    }
    const user: any = extractUserFromHeader(req.headers);
    const timezone: any = getTimezone(req.headers);

    const subdomain = getSubdomain(req);

    const processId = nanoid(12);

    const __ = (doc: any) => ({ processId, ...doc });

    const context = {
      user,
      req,
      res,
      subdomain,
      __,
      processId,
      requestInfo: {
        secure: req.secure,
        cookies: req.cookies,
        timezone,
      },
    };

    if (apolloServerContext) {
      await apolloServerContext(subdomain, context, req, res);
    }

    return context;
  };
