import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IClass, IClassDocument } from '~/modules/class/@types/classes';
import { classSchema } from '~/modules/class/db/definitions/class';

export interface IClassModel extends Model<IClassDocument> {
  createClass(doc: IClass): Promise<IClassDocument>;
  getClass(_id: string): Promise<IClassDocument>;
  updateClass(_id: string, doc: IClass): Promise<IClassDocument>;
}

export const loadClassesClass = (models: IModels) => {
  class Class {
    static async generateClassDates(
      startDate: string,
      daysOfWeek: string[],
      entries: number,
    ) {
      const dates: string[] = [];
      const currentDate = moment(startDate);

      while (dates.length < entries) {
        if (daysOfWeek.includes(currentDate.format('dddd'))) {
          dates.push(currentDate.format('YYYY-MM-DD'));
        }
        currentDate.add(1, 'day');
      }

      return dates;
    }

    public static async getClass(_id: string) {
      const courseClass = await models.Classes.findOne({ _id });

      if (!courseClass) {
        throw new Error('Class not found');
      }

      return courseClass;
    }

    public static async createClass(doc) {
      const course = await models.Courses.getCourse(doc.activityId);

      const startDate = moment(course.startDate).format('YYYY-MM-DD');

      const schedules = await this.generateClassDates(
        startDate,
        doc.dates,
        doc.entries,
      );

      return models.Classes.create({
        ...doc,
        schedules,
        createdAt: new Date(),
        modifiedAt: new Date(),
      });
    }

    public static async updateClass(_id, doc) {
      const course = await models.Courses.getCourse(doc.activityId);

      const startDate = moment(course.startDate).format('YYYY-MM-DD');

      const schedules = await this.generateClassDates(
        startDate,
        doc.dates,
        doc.entries,
      );
      await models.Classes.updateOne(
        { _id },
        { $set: { ...doc, schedules, modifiedAt: new Date() } },
      );

      return models.Classes.findOne({ _id });
    }
  }
  classSchema.loadClass(Class);

  return classSchema;
};
