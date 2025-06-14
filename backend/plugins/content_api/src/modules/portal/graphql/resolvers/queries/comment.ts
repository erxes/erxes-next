import { cursorPaginate } from 'erxes-api-shared/src/utils';
import { IContext } from '~/connectionResolvers';

const commentQueries = {
  async clientPortalComments(
    _root,
    { typeId, type, ...args }: { typeId: string; type: string },
    { models }: IContext
  ) {
    const { list, totalCount, pageInfo } = await cursorPaginate({
      model: models.Comments,
      params: args,
      query: { typeId, type },
    });

    return { list, totalCount, pageInfo };
  }
};

export default commentQueries;
