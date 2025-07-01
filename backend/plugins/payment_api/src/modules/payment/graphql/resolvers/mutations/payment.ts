
  import { IContext } from '~/connectionResolvers';

  export const paymentMutations = {
    createPayment: async (_parent: undefined, { name }, { models }: IContext) => {
      return models.Payment.createPayment({name});
    },

    updatePayment: async (_parent: undefined, { _id, name }, { models }: IContext) => {
      return models.Payment.updatePayment(_id, {name});
    },

    removePayment: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Payment.removePayment(_id);
    },
  };

