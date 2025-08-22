export default {
  name: 'operation',
  typeDefs: `
			operationTaskChanged(_id: String!): Task
      operationTasksChanged(_id: String!): [Task]
      operationActivityChanged(contentId: String!): OperationActivity
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
        resolve(payload, _args, { dataSources: { gatewayDataSource } }, info) {
          if (!payload) {
            console.error(
              `Subscription resolver error: operationActivityChanged: payload is ${payload}`,
            );
            return;
          }
          if (!payload.operationActivityChanged) {
            console.error(
              `Subscription resolver error: operationActivityChanged: payload.operationActivityChanged is ${payload.operationActivityChanged}`,
            );
            return;
          }
          if (!payload.operationActivityChanged.contentId) {
            console.error(
              `Subscription resolver error: operationActivityChanged: payload.operationActivityChanged.contentId is ${payload.operationActivityChanged.contentId}`,
            );
            return;
          }

          return gatewayDataSource.queryAndMergeMissingData({
            payload,
            info,
            queryVariables: {
              contentId: payload.operationActivityChanged.contentId,
            },
            buildQueryUsingSelections: (selections) => `
                  query Subscription_GetOperationActivity($contentId: String!) {
                    getOperationActivities(contentId: $contentId) {
                      ${selections}
                    }
                  }
              `,
          });
        },
        subscribe: (_, { contentId }) =>
          graphqlPubsub.asyncIterator(`operationActivityChanged:${contentId}`),
      },
    };
  },
};
