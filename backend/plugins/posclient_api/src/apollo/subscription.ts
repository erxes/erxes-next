import { withFilter } from 'graphql-subscriptions';
import getTypeDefs from '~/modules/posclient/graphql/subscriptions/genTypeDefs';

//tslint:disable
export default {
  name: 'posclient',
  typeDefs: getTypeDefs(),
  generateResolvers: (graphqlPubsub) => {
    return {
      transactionUpdated: {
        subscribe: (_, { invoiceId }) =>
          graphqlPubsub.asyncIterator(`transactionUpdated:${invoiceId}`),
      },
      ordersOrdered: {
        subscribe: withFilter(
          () => graphqlPubsub.asyncIterator('ordersOrdered'),
          (payload, variables) => {
            const { status, customerId, posToken, subToken } = payload
              .ordersOrdered._doc
              ? payload.ordersOrdered._doc
              : payload.ordersOrdered;
            if (variables.customerId) {
              return (
                (variables.posToken === posToken ||
                  variables.posToken === subToken) &&
                variables.statuses.includes(status) &&
                variables.customerId === customerId
              );
            }

            return (
              (variables.posToken === posToken ||
                variables.posToken === subToken) &&
              variables.statuses.includes(status)
            );
          },
        ),
      },
    };
  },
};
