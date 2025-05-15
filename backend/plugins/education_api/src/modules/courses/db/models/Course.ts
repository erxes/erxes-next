import { Model } from 'mongoose';
import { ICourse, ICourseDocument } from '@/courses/@types/course';
import { courseSchema } from '@/courses/db/definitions/course';
import { IModels } from '~/connectionResolvers';
import { validSearchText } from 'erxes-api-shared/utils';

export interface ICourseModel extends Model<ICourseDocument> {
  createCourse(doc: ICourse): Promise<ICourseDocument>;
  getCourse(_id: string): Promise<ICourseDocument>;
  updateCourse(_id: string, doc: ICourse): Promise<ICourseDocument>;
  removeCourses(courseIds: string[]): Promise<ICourseDocument>;
}

export const loadCourseClass = (models: IModels) => {
  class Course {
    public static fillSearchText(doc: ICourse) {
      return validSearchText([doc.name || '', doc.description || '']);
    }
    /**
     * Retreives course
     */
    public static async getCourse(_id: string) {
      const course = await models.Courses.findOne({ _id });

      if (!course) {
        throw new Error('Course not found');
      }

      return course;
    }

    /**
     * Create a course
     */
    public static async createCourse(doc) {
      const course = await models.Courses.create({
        ...doc,
        createdAt: new Date(),
        modifiedAt: new Date(),
        searchText: this.fillSearchText(doc),
      });

      return course;
    }

    /**
     * Remove course
     */
    public static async removeCourses(courseIds) {
      return models.Courses.deleteMany({ _id: { $in: courseIds } });
    }

    /**
     * Update course
     */
    public static async updateCourse(_id, doc) {
      const searchText = this.fillSearchText(
        Object.assign(await models.Courses.createCourse(_id), doc),
      );
      await models.Courses.updateOne(
        { _id },
        { $set: { ...doc, searchText, modifiedAt: new Date() } },
      );

      return models.Courses.findOne({ _id });
    }
  }
  courseSchema.loadClass(Course);

  return courseSchema;
};
