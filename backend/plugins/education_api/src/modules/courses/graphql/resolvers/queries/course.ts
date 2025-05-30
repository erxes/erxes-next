import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext, IModels } from '~/connectionResolvers';
import { ICourseParams } from '~/modules/courses/@types/course';

const generateFilter = async (
  models: IModels,
  commonQuerySelector: any,
  params,
) => {
  const filter: any = commonQuerySelector;

  if (params.categoryId) {
    filter.categoryId = params.categoryId;
  }

  if (params.searchValue) {
    filter.searchText = { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] };
  }

  if (params.statuses) {
    filter.status = { $in: params.statuses };
  }

  if (params.ids) {
    filter._id = { $in: params.ids };
  }

  return filter;
};

export const sortBuilder = (params) => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};

export const courseQueries = {
  courses: async (
    _root: undefined,
    params: ICourseParams,
    { commonQuerySelector, models }: IContext,
  ) => {
    const filter = await generateFilter(models, commonQuerySelector, params);

    const { list, totalCount, pageInfo } = await cursorPaginate({
      model: models.Courses,
      params,
      query: filter,
    });

    return { list, totalCount, pageInfo };
  },

  courseDetail: async (_root, { _id }, { models }: IContext) => {
    return models.Courses.getCourse(_id);
  },

  courseCategories: async (
    _root,
    { parentId, searchValue },
    { commonQuerySelector, models }: IContext,
  ) => {
    const filter: any = commonQuerySelector;

    if (parentId) {
      filter.parentId = parentId;
    }

    if (searchValue) {
      filter.name = new RegExp(`.*${searchValue}.*`, 'i');
    }

    return models.CourseCategories.find(filter).sort({ order: 1 });
  },

  activityCategoriesTotalCount: async (_root, _param, { models }: IContext) => {
    return models.CourseCategories.find().countDocuments();
  },
};
