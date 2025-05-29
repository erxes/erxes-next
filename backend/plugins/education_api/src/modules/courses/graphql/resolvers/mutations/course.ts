import { IContext } from '~/connectionResolvers';
import { ICourseCategory } from '@/courses/@types/category';
import { ICourse } from '@/courses/@types/course';

export const courseMutations = {
  /**
   * Creates a new course
   */
  courseAdd: async (_root, doc: ICourse, { models }: IContext) => {
    return await models.Courses.createCourse(doc);
  },
  /**
   * Edit a course
   */
  courseEdit: async (
    _root,
    { _id, ...doc }: { _id: string } & ICourse,
    { models }: IContext,
  ) => {
    return await models.Courses.updateCourse(_id, doc);
  },
  /**
   * Removes course
   */
  courseRemove: async (
    _root,
    { courseIds }: { courseIds: string[] },
    { models }: IContext,
  ) => {
    await models.Courses.removeCourses(courseIds);

    return courseIds;
  },
  /**
   * Change a status of course
   */
  changeCourseStatus: async (
    _root,
    { _id, status }: { _id: string; status: string },
    { models }: IContext,
  ) => {
    const updated = await models.Courses.findOneAndUpdate(
      { _id },
      { $set: { status } },
      { new: true },
    );
    return updated;
  },
  /**
   * Create a course category
   */
  courseCategoryAdd: async (
    _root,
    doc: ICourseCategory,
    { models }: IContext,
  ) => {
    return await models.CourseCategories.createCourseCategory(doc);
  },
  /**
   * Edits a course category
   */
  courseCategoryEdit: async (
    _root,
    { _id, ...doc }: { _id: string } & ICourseCategory,
    { models }: IContext,
  ) => {
    return await models.CourseCategories.updateCourseCategory(
      _id,
      doc as ICourseCategory,
    );
  },
  /**
   * Delete a course category
   */
  courseCategoryRemove: async (
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.CourseCategories.removeCourseCategory(_id);
  },
};
