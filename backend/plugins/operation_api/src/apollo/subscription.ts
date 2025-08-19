export default {
  name: 'operation',
  typeDefs: `
			operationTaskChanged(_id: String!): Task
		`,
  generateResolvers: (graphqlPubsub) => {
    return {
      /*
       * Listen for new message insertion
       */
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
          console.log(payload);
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
    };
  },
};
