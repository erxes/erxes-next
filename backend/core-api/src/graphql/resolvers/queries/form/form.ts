import { IContext } from 'backend/core-api/src/connectionResolvers';
import { paginate } from 'erxes-api-utils';

const generateFilterQuery = async (
  { type, brandId, searchValue, tag, status },
  models,
) => {
  const query: any = {};

  if (type) {
    query.type = type;
  }

  if (brandId) {
    query.brandId = brandId;
  }

  if (searchValue) {
    query.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  if (status) {
    query.status = status;
  }

  return query;
};

export default {
  /**
   * Forms list
   */
  async forms(
    _root,
    args: {
      page: number;
      perPage: number;
      type: string;
      searchValue: string;
      brandId: string;
      tag: string;
      status: string;
      sortField: string;
      sortDirection: number;
    },
    { models }: IContext,
  ) {
    const filter = await generateFilterQuery(args, models);

    const sort: any = { createdAt: -1 };

    if (args.sortDirection && args.sortField) {
      sort[args.sortField] = args.sortDirection;
    }

    if (args.type === 'lead') {
      return models.Forms.findLeadForms(filter, args);
    }

    return paginate(models.Forms.find(filter).sort(sort), args);
  },

  async formsTotalCount(_root, args, { models }: IContext) {
    const counts = {
      total: 0,
      byTag: {},
      byBrand: {},
      byStatus: { active: 0, archived: 0 },
    };

    const filter = await generateFilterQuery(args, models);

    const count = async (query) => {
      return models.Forms.find(query).countDocuments();
    };

    counts.byStatus.active = await count({ status: 'active', ...filter });
    counts.byStatus.archived = await count({ status: 'archived', ...filter });

    if (args.status) {
      if (args.status === 'active') {
        counts.byStatus.archived = 0;
      } else {
        counts.byStatus.active = 0;
      }
    }

    counts.total = await count(filter);

    return counts;
  },

  /**
   * Get one form
   */
  async formDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Forms.findOne({ _id });
  },
};
