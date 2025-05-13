import { Model } from 'mongoose';
import {
  ICourseCategory,
  ICourseCategoryDocument,
} from '@/courses/@types/category';
import { IModels } from '~/connectionResolvers';
import { courseCategorySchema } from '@/courses/db/definitions/category';

export interface ICourseCategoryModel extends Model<ICourseCategoryDocument> {
  getCourseCategory(selector: any): Promise<ICourseCategoryDocument>;
  createCourseCategory(doc: ICourseCategory): Promise<ICourseCategoryDocument>;
  updateCourseCategory(
    _id: string,
    doc: ICourseCategory,
  ): Promise<ICourseCategoryDocument>;
  removeCourseCategory(_id: string): Promise<ICourseCategoryDocument>;
  generateOrder(
    parentCategory: any,
    doc: ICourseCategory,
  ): Promise<ICourseCategoryDocument>;
}

export const loadCourseCategoryClass = (models: IModels) => {
  class CourseCategory {
    /**
     *
     * Get Course Cagegory
     */

    public static async getActivityCategory(selector: any) {
      const courseCategory = await models.CourseCategories.findOne(selector);

      if (!courseCategory) {
        throw new Error('Course category not found');
      }

      return courseCategory;
    }
    /**
     * Create a course categorys
     */
    public static async createCourseCategory(doc) {
      const parentCategory = doc.parentId
        ? await models.CourseCategories.findOne({
            _id: doc.parentId,
          }).lean()
        : undefined;

      // Generating order
      doc.order = await this.generateOrder(parentCategory, doc);

      return models.CourseCategories.create(doc);
    }

    /**
     * Update Activity category
     */
    public static async updateCourseCategory(_id, doc) {
      const parentCategory = doc.parentId
        ? await models.CourseCategories.findOne({
            _id: doc.parentId,
          }).lean()
        : undefined;

      if (parentCategory && parentCategory.parentId === _id) {
        throw new Error('Cannot change category');
      }

      // Generatingg  order
      doc.order = await this.generateOrder(parentCategory, doc);

      const courseCategory = await models.CourseCategories.getCourseCategory({
        _id,
      });

      const childCategories = await models.CourseCategories.find({
        $and: [
          { order: { $regex: new RegExp(courseCategory.order, 'i') } },
          { _id: { $ne: _id } },
        ],
      });

      await models.CourseCategories.updateOne({ _id }, { $set: doc });

      // updating child categories order
      childCategories.forEach(async (category) => {
        let order = category.order;

        order = order.replace(courseCategory.order, doc.order);

        await models.CourseCategories.updateOne(
          { _id: category._id },
          { $set: { order } },
        );
      });

      return models.CourseCategories.findOne({ _id });
    }

    /**
     * Remove course category
     */
    public static async removeCourseCategory(_id) {
      await models.CourseCategories.getCourseCategory({ _id });

      let count = await models.Courses.countDocuments({ categoryId: _id });

      count += await models.CourseCategories.countDocuments({
        parentId: _id,
      });

      if (count > 0) {
        throw new Error("Can't remove a course category");
      }

      return models.CourseCategories.deleteOne({ _id });
    }

    /**
     * Generating order
     */
    public static async generateOrder(parentCategory, doc) {
      const order = parentCategory
        ? `${parentCategory.order}/${doc.code}`
        : `${doc.code}`;

      return order;
    }
  }

  courseCategorySchema.loadClass(CourseCategory);

  return courseCategorySchema;
};
