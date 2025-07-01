
  import { IContext } from '~/connectionResolvers';

   export const paymentQueries = {
    getPayment: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Payment.getPayment(_id);
    },
    
    getPayments: async (_parent: undefined, { models }: IContext) => {
      return models.Payment.getPayments();
    },
  };
