import { IContext } from '~/connectionResolvers';

export const appQueries = {
  async apps(_root: undefined, args, { models }: IContext) {
    const { searchValue } = args;
    const qry: any = {};
    if (searchValue) {
      qry.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    return models.Apps.find(qry);
  },

  async appTotalCount(_root: undefined, args, { models }: IContext) {
    const { searchValue } = args;
    const qry: any = {};
    if (searchValue) {
      qry.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    return models.Apps.find(qry).countDocuments();
  },

  async appDetail(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Apps.findOne({ _id });
  },
};
