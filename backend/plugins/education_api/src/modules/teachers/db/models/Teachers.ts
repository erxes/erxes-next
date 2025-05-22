import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { ITeacher, ITeacherDocument } from '@/teachers/@types/teachers';
import { teacherSchema } from '@/teachers/db/definitions/teachers';

export interface ITeacherModel extends Model<ITeacherDocument> {
  getTeacher(_id: string): Promise<ITeacherDocument>;
  createTeacher(doc: ITeacher): Promise<ITeacherDocument>;
  deleteTeacher(_id: string): void;
}

export const loadTeacherClass = (models: IModels) => {
  class Teacher {
    public static async getTeacher(_id: string) {
      const teacher = await models.Teachers.findOne({ _id });

      if (!teacher) {
        throw new Error('Teacher not found');
      }

      return teacher;
    }

    public static async createTeacher(doc: ITeacherDocument) {
      return models.Teachers.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async deleteTeacher(_id: string) {
      return models.Teachers.deleteOne({ _id });
    }
  }

  teacherSchema.loadClass(Teacher);

  return teacherSchema;
};
