import { IMainContext } from '../../core-types';
import { GraphQLResolveInfo } from 'graphql';
import { logHandler } from '../logs';

type GraphqlLogHandler<TArgs = any, TReturn = any> = (
  root: any,
  args: TArgs,
  context: IMainContext,
  info: GraphQLResolveInfo,
) => Promise<TReturn> | TReturn;

const withLogging = (resolver: GraphqlLogHandler): GraphqlLogHandler => {
  return async (root, args, context, info) => {
    const { user, req } = context;
    const requestData = req.headers;

    return await logHandler(
      async () => await resolver(root, args, context, info),
      {
        source: 'graphql',
        action: 'mutations',
        payload: {
          mutationName: info.fieldName,
          requestData,
          args,
        },
        userId: user?._id,
      },
    );
  };
};

// Apply middleware to all mutations in an object
export const wrapApolloMutations = (
  mutations: Record<string, GraphqlLogHandler>,
  muataionsForSkip?: string[],
) => {
  const wrappedMutations: Record<string, GraphqlLogHandler> = {};

  for (const [key, resolver] of Object.entries(mutations)) {
    if (muataionsForSkip?.includes(key)) {
      continue;
    }
    wrappedMutations[key] = withLogging(resolver);
  }

  return wrappedMutations;
};
