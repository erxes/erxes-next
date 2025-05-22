import mongoose from 'mongoose';
import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { loadCourseClass, ICourseModel } from '@/courses/db/models/Course';
import {
  loadCourseCategoryClass,
  ICourseCategoryModel,
} from '@/courses/db/models/Categories';
import { IClassModel, loadClassesClass } from '@/class/db/models/Classes';
import { ICommentModel, loadCommentClass } from '@/comments/db/models/Comments';
import { ITeacherModel, loadTeacherClass } from '@/teachers/db/models/Teachers';
//
import { ICourseDocument } from '@/courses/@types/course';
import { IClassDocument } from '@/class/@types/classes';
import { ICourseCategoryDocument } from '@/courses/@types/category';
import { ICommentDocument } from '@/comments/@types/comments';
import { ITeacherDocument } from '@/teachers/@types/teachers';

export interface IModels {
  Courses: ICourseModel;
  CourseCategories: ICourseCategoryModel;
  Classes: IClassModel;
  Comments: ICommentModel;
  Teachers: ITeacherModel;
}

export interface IContext extends IMainContext {
  commonQuerySelector: any;
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

  models.Classes = db.model<IClassDocument, IClassModel>(
    'course_classes',
    loadClassesClass(models),
  );

  models.Comments = db.model<ICommentDocument, ICommentModel>(
    'course_comments',
    loadCommentClass(models),
  );

  models.Teachers = db.model<ITeacherDocument, ITeacherModel>(
    'course_teachers',
    loadTeacherClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
