import { IContext } from '~/connectionResolvers';
import { ICourseDocument } from '~/modules/courses/@types/course';

export default {
  category: async (course: ICourseDocument, _, { models }: IContext) => {
    return models.CourseCategories.findOne({
      _id: course?.categoryId,
    });
  },
};
