import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IStudent, IStudentDocument } from '@/students/@types/students';
import { studentSchema } from '@/students/db/definitions/students';

export interface IStudentModel extends Model<IStudentDocument> {
  getStudent(_id: string): Promise<IStudentDocument>;
  createStudent(doc: IStudent): Promise<IStudentDocument>;
  deleteStudent(_id: string): void;
}

export const loadStudentClass = (models: IModels) => {
  class Student {
    public static async getStudent(_id: string) {
      const student = await models.Students.findOne({ _id });

      if (!student) {
        throw new Error('Student not found');
      }

      return student;
    }

    public static async createStudent(doc: IStudentDocument) {
      return models.Students.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async deleteStudent(_id: string) {
      return models.Students.deleteOne({ _id });
    }
  }

  studentSchema.loadClass(Student);

  return studentSchema;
};
