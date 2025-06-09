import { IContext } from '~/connectionResolvers';

const ClientPortal = {
  __resolveReference: async ({ _id }, { models }: IContext) => {
    return models.Portals.findOne({ _id });
  },
};

export { ClientPortal };
