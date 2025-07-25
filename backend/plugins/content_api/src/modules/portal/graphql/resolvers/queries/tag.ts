import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

const queries = {
  /**
   * Cms tags list
   */
  async cmsTags(_parent: any, args: any, context: IContext): Promise<any> {
    const { models } = context;
    const {
      searchValue,
      status,
    } = args;
    const clientPortalId = context.clientPortalId || args.clientPortalId;
    const query = {
      clientPortalId,
      ...(status && { status }),
    };

    if (searchValue) {
      query.$or = [
        { name: { $regex: searchValue, $options: 'i' } },
        { slug: { $regex: searchValue, $options: 'i' } },
      ];
    }

    const { list, totalCount, pageInfo } = await cursorPaginate({
      model: models.PostTags,
      params: args,
      query,
    });

    return { list, totalCount, pageInfo };
  },

  /**
   * Cms tag
   */
  async cmsTag(_parent: any, args: any, context: IContext): Promise<any> {
    const { models } = context;
    const { _id, slug } = args;
    const clientPortalId = context.clientPortalId || args.clientPortalId;
    if (!_id && !slug) {
      return null;
    }

    if (slug) {
      return models.PostTags.findOne({ slug, clientPortalId });
    }

    return models.PostTags.findOne({ _id });
  },
};

export default queries;
