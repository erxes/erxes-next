import { IContext } from '~/connectionResolvers';
import { ICourseDocument } from '@/courses/@types/course';

export default {
  category: async (course: ICourseDocument, _, { models }: IContext) => {
    return models.CourseCategories.findOne({
      _id: course?.categoryId,
    });
  },
  class: async (course: ICourseDocument, _, { models }: IContext) => {
    return models.Classes.findOne({
      _id: course?.classId,
    });
  },
};
