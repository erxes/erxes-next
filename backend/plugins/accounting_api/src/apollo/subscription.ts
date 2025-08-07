import { withFilter } from 'graphql-subscriptions';

export default {
  name: 'accounting',
  typeDefs: `
			accountingAdjustInventoryChanged(adjustId: String!): accountingAdjustInventoryChangedResponse
		`,
  generateResolvers: (graphqlPubsub) => {
    return {
      /*
       * Listen for conversation changes like status, assignee, read state
       */
      accountingAdjustInventoryChanged: {
        subscribe: (_, { _id }) =>
          graphqlPubsub.asyncIterator(`accountingAdjustInventoryChanged:${_id}`),
      },
    };
  },
};
