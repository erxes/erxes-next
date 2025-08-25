import { withFilter } from 'graphql-subscriptions';

export default {
  name: 'operation',
  typeDefs: `
			operationTaskChanged(_id: String!): Task
      operationTasksChanged(filter: ITaskFilter): Task
      operationActivityChanged(contentId: String!): OperationActivitySubscription
		`,
  generateResolvers: (graphqlPubsub) => {
    return {
      operationTaskChanged: {
        resolve(payload, _args, { dataSources: { gatewayDataSource } }, info) {
          if (!payload) {
            console.error(
              `Subscription resolver error: operationTaskChanged: payload is ${payload}`,
            );
            return;
          }
          if (!payload.operationTaskChanged) {
            console.error(
              `Subscription resolver error: operationTaskChanged: payload.operationTaskChanged is ${payload.operationTaskChanged}`,
            );
            return;
          }
          if (!payload.operationTaskChanged._id) {
            console.error(
              `Subscription resolver error: operationTaskChanged: payload.operationTaskChanged._id is ${payload.operationTaskChanged._id}`,
            );
            return;
          }

          return gatewayDataSource.queryAndMergeMissingData({
            payload,
            info,
            queryVariables: { _id: payload.operationTaskChanged._id },
            buildQueryUsingSelections: (selections) => `
                  query Subscription_GetTask($_id: String!) {
                    getTask(_id: $_id) {
                      ${selections}
                    }
                  }
              `,
          });
        },
        subscribe: (_, { _id }) =>
          graphqlPubsub.asyncIterator(`operationTaskChanged:${_id}`),
      },
      operationActivityChanged: {
        resolve: (payload) => payload.operationActivityChanged,
        subscribe: (_, { contentId }) =>
          graphqlPubsub.asyncIterator(`operationActivityChanged:${contentId}`),
      },

      operationTasksChanged: {
        resolve: (payload) => payload.operationTasksChanged,
        subscribe: withFilter(
          () => graphqlPubsub.asyncIterator('operationTasksChanged'),
          (payload, variables) => {
            const task = payload.operationTasksChanged;
            const f = variables.filter || {};

            if (f.status && task.status !== f.status) return false;
            if (f.priority && task.priority !== f.priority) return false;
            if (f.teamId && task.teamId !== f.teamId) return false;
            if (f.projectId && task.projectId !== f.projectId) return false;
            if (f.assigneeId && task.assigneeId !== f.assigneeId) return false;
            if (f.userId && task.assigneeId !== f.userId) return false;

            // name filter → regex шалгах
            if (f.name && !new RegExp(f.name, 'i').test(task.name))
              return false;

            return true;
          },
        ),
      },
    };
  },
};
