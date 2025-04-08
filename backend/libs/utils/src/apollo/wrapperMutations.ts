import { GraphQLResolveInfo } from 'graphql';
import { IMainContext } from 'erxes-core-types';
import { sendWorkerQueue } from '../mq-worker';

const LOG_STATUSES = {
  SUCCESS: 'success',
  FAILED: 'failed',
};

type GraphqlLogHandler<TArgs = any, TReturn = any> = (
  root: any,
  args: TArgs,
  context: IMainContext,
  info: GraphQLResolveInfo,
) => Promise<TReturn> | TReturn;

const withLogging = (resolver: GraphqlLogHandler): GraphqlLogHandler => {
  return async (root, args, context, info) => {
    const { user, req } = context;

    const startTime = performance.now();
    const requestData = req.headers;

    const queueData: any = {
      source: 'graphql',
      action: 'mutations',
      payload: {
        mutationName: info.fieldName,
        requestData,
        args,
      },
      userId: user?._id,
    };

    try {
      const result = await resolver(root, args, context, info);
      const endTime = performance.now();
      const durationMs = endTime - startTime;

      const executionTime = { start: startTime, endTime: endTime, durationMs };

      queueData.payload.result = result;
      queueData.payload.executionTime = executionTime;
      queueData.status = LOG_STATUSES.SUCCESS;

      sendWorkerQueue('logs', 'put_log').add('put_log', queueData);
      return result;
    } catch (error: any) {
      const errorDetails = {
        message: error.message || 'Unknown error',
        stack: error.stack || 'No stack available',
        name: error.name || 'Error',
      };

      queueData.payload.result = errorDetails;
      queueData.status = LOG_STATUSES.FAILED;
      sendWorkerQueue('logs', 'put_log').add('put_log', queueData);
      throw error;
    }
  };
};

// Apply middleware to all mutations in an object
export const wrapApolloMutations = (
  mutations: Record<string, GraphqlLogHandler>,
) => {
  const wrappedMutations: Record<string, GraphqlLogHandler> = {};

  for (const [key, resolver] of Object.entries(mutations)) {
    wrappedMutations[key] = withLogging(resolver);
  }

  return wrappedMutations;
};
