import { escapeRegExp } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ICourseCategoryDocument } from '@/courses/@types/category';

export default {
  __resolveReference: async (
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.CourseCategories.findOne({ _id });
  },
  isRoot: (category: ICourseCategoryDocument) => {
    return !category.parentId;
  },
  courseCount: async (
    category: ICourseCategoryDocument,
    _args: undefined,
    { models }: IContext,
  ) => {
    const course_category_ids = await models.CourseCategories.find(
      { order: { $regex: new RegExp(`^${escapeRegExp(category.order)}`) } },
      { _id: 1 },
    );
    return models.Courses.countDocuments({
      categoryId: { $in: course_category_ids },
    });
  },
};
