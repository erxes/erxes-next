import { IContext } from 'backend/core-api/src/connectionResolvers';
import { paginate } from 'erxes-api-utils';
export const appQueries = {
  async apps(_root, args, { models }: IContext) {
    const { searchValue } = args;
    const qry: any = {};
    if (searchValue) {
      qry.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    return models.Apps.find(qry).lean();
  },

  async appsTotalCount(_root, args, { models }: IContext) {
    const { searchValue } = args;
    const qry: any = {};
    if (searchValue) {
      qry.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    return models.Apps.find(qry).countDocuments();
  },

  async appDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Apps.findOne({ _id });
  },

  async clientDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Clients.getClient({ _id });
  },

  async clientList(_root, args, { models }: IContext) {
    const { page = 1, perPage = 20, searchValue } = args;
    const qry: any = {};

    if (searchValue) {
      qry.name = new RegExp(`.*${searchValue}.*`, 'i');
    }

    const list = await paginate(
      models.Clients.find(qry).sort({ createdAt: -1 }),
      {
        page,
        perPage,
      },
    );

    const totalCount = await models.Clients.find(qry).countDocuments();

    return { list, totalCount };
  },
};

export default appQueries;
