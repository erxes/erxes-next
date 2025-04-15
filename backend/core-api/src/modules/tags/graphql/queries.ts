import { getPlugin, getPlugins, defaultPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { ITagFilterQueryParams } from '@/tags/@types/tag';

const generateFilter = async ({ params, commonQuerySelector, models }) => {
  const { type, searchValue, tagIds, parentId, ids, excludeIds } = params;

  const filter: FilterQuery<ITagFilterQueryParams> = { ...commonQuerySelector };

  if (type) {
    filter.type = type;
  }

  if (searchValue) {
    filter.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  if (tagIds) {
    filter._id = { $in: tagIds };
  }

  if (ids && ids.length > 0) {
    filter._id = { [excludeIds ? '$nin' : '$in']: ids };
  }

  if (parentId) {
    const parentTag = await models.Tags.find({ parentId }).distinct('_id');
    let ids = [parentId, ...parentTag];

    const getChildTags = async (parentTagIds: string[]) => {
      const childTag = await models.Tags.find({
        parentId: { $in: parentTagIds },
      }).distinct('_id');

      if (childTag.length > 0) {
        ids = [...ids, ...childTag];
        await getChildTags(childTag);
      }

      return;
    };

    await getChildTags(parentTag);

    filter._id = { $in: ids };
  }

  return filter;
};

export const tagQueries = {
  /**
   * Get tag types
   */
  async tagsGetTypes() {
    const services = await getPlugins();
    const fieldTypes: Array<{ description: string; contentType: string }> = [];
    for (const serviceName of services) {
      const service = await getPlugin(serviceName);
      const meta = service.config.meta || {};
      if (meta && meta.tags) {
        const types = meta.tags.types || [];

        for (const type of types) {
          fieldTypes.push({
            description: type.description,
            contentType: `${serviceName}:${type.type}`,
          });
        }
      }
    }

    return fieldTypes;
  },

  /**
   * Get tags
   */
  async tags(
    _root: undefined,
    params: ITagFilterQueryParams,
    { models, commonQuerySelector }: IContext,
  ) {
    const filter = await generateFilter({
      params,
      commonQuerySelector,
      models,
    });

    const tags = await defaultPaginate(
      models.Tags.find(filter).sort({
        order: 1,
      }),
      params,
    );

    return tags;
  },

  async tagsQueryCount(
    _root: undefined,
    {
      type,
      searchValue,
    }: {
      type: string;
      searchValue?: string;
    },
    { models, commonQuerySelector }: IContext,
  ) {
    const selector: any = { ...commonQuerySelector };

    if (type) {
      selector.type = type;
    }

    if (searchValue) {
      selector.name = new RegExp(`.*${searchValue}.*`, 'i');
    }

    const tagsCount = await models.Tags.find(selector).countDocuments();

    return tagsCount;
  },

  /**
   * Get one tag
   */
  async tagDetail(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Tags.findOne({ _id });
  },
};
