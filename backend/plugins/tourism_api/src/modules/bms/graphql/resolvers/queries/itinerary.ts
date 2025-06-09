import { cursorPaginate } from 'erxes-api-shared/src/utils';
import { IContext } from '~/connectionResolvers';

const itineraryQueries = {
  async bmItineraries(_root, { branchId, ...params }, { models }: IContext) {
    const selector: any = {};
    if (branchId) {
      selector.branchId = branchId;
    }

    const { list, totalCount, pageInfo } = await cursorPaginate({
      model: models.Itineraries,
      params,
      query: selector,
    });

    return { list, totalCount, pageInfo };
  },

  async bmItineraryDetail(_root, { _id }, { models }: IContext) {
    return await models.Itineraries.findById(_id);
  },
};

export default itineraryQueries;
