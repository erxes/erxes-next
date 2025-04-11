import { IContext } from '~/connectionResolvers';

export interface IListArgs {
  page?: number;
  limit?: number;
}

export const appQueries = {
  async apps(_root, args, { models }: IContext) {
    const { searchValue } = args;
    const qry: any = {};
    if (searchValue) {
      qry.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    return models.Apps.find(qry);
  },

  async appTotalCount(_root, args, { models }: IContext) {
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
};
