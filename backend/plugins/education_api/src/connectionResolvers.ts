import mongoose from 'mongoose';
import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { ICourseDocument } from '@/courses/@types/course';
import { ICourseCategoryDocument } from '@/courses/@types/category';
import { loadCourseClass, ICourseModel } from '@/courses/db/models/Course';
import {
  loadCourseCategoryClass,
  ICourseCategoryModel,
} from '@/courses/db/models/Categories';

export interface IModels {
  Courses: ICourseModel;
  CourseCategories: ICourseCategoryModel;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Courses = db.model<ICourseDocument, ICourseModel>(
    'courses',
    loadCourseClass(models),
  );

  models.CourseCategories = db.model<
    ICourseCategoryDocument,
    ICourseCategoryModel
  >('course_categories', loadCourseCategoryClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
