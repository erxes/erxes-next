import { IContext } from 'backend/core-api/src/connectionResolvers';
import { paginate } from 'erxes-api-utils';

interface IListParams {
  page: number;
  perPage: number;
  searchValue: string;
  status: string;
}

const generateFilter = (commonSelector, args: IListParams) => {
  const { searchValue, status } = args;

  const filter: any = commonSelector;

  if (searchValue) {
    filter.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  return filter;
};

export const emailTemplateQueries = {
  /**
   * Email templates list
   */
  async emailTemplates(
    _root,
    args: IListParams,
    { commonQuerySelector, models }: IContext,
  ) {
    const filter = generateFilter(commonQuerySelector, args);

    return paginate(
      models.EmailTemplates.find(filter).sort({ createdAt: -1 }),
      args,
    );
  },

  /**
   * Get all email templates count. We will use it in pager
   */
  async emailTemplatesTotalCount(_root, { searchValue }, { models }: IContext) {
    const filter: any = {};

    if (searchValue) {
      filter.name = new RegExp(`.*${searchValue}.*`, 'i');
    }

    return models.EmailTemplates.find(filter).countDocuments();
  },

  async emailTemplate(_root, { _id }, { models }: IContext) {
    return models.EmailTemplates.findOne({ _id }).lean();
  },
};

export default emailTemplateQueries;
