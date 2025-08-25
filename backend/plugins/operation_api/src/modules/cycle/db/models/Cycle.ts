import { FilterQuery, Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { ICycle, ICycleDocument } from '@/cycle/types';
import { cycleSchema } from '@/cycle/db/definitions/cycle';

export interface ICycleModel extends Model<ICycleDocument> {
  getCycle(_id: string): Promise<ICycleDocument>;
  getCycles(filter: FilterQuery<ICycleDocument>): Promise<ICycleDocument[]>;
  createCycle({
    doc,
    subdomain,
  }: {
    doc: ICycle;
    subdomain: string;
  }): Promise<ICycleDocument>;
  updateCycle(doc: ICycleDocument): Promise<ICycleDocument>;
  removeCycle({
    _id,
    userId,
  }: {
    _id: string;
    userId: string;
  }): Promise<{ ok: number }>;
}

export const loadCycleClass = (models: IModels) => {
  class Cycle {
    public static async getCycle(_id: string) {
      const cycle = await models.Cycle.findOne({ _id });
      if (!cycle) {
        throw new Error('Cycle not found');
      }
      return cycle;
    }

    public static async createCycle({
      doc,
    }: {
      doc: ICycle;
    }): Promise<ICycleDocument> {
      const { startDate, endDate } = doc;

      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }

      if (startDate > endDate) {
        throw new Error('Start date must be before end date');
      }
      const overlappingCycle = await models.Cycle.findOne({
        teamId: doc.teamId,
        $or: [
          {
            startDate: { $lte: doc.endDate },
            endDate: { $gte: doc.startDate },
          },
        ],
      });

      if (overlappingCycle) {
        throw new Error('New cycle overlaps with an existing cycle');
      }

      const [result] = await models.Cycle.aggregate([
        { $match: { teamId: doc.teamId } },
        { $group: { _id: null, maxNumber: { $max: '$number' } } },
      ]);

      const nextNumber = (result?.maxNumber || 0) + 1;
      doc.number = nextNumber;

      return models.Cycle.create(doc);
    }

    public static async updateCycle(doc: ICycleDocument) {
      const cycle = await models.Cycle.findOne({ _id: doc._id });

      if (cycle && cycle.isCompleted) {
        throw new Error('Completed cycle cannot be updated');
      }

      const overlappingCycle = await models.Cycle.findOne({
        teamId: doc.teamId,
        _id: { $ne: doc._id },
        $or: [
          {
            startDate: { $lte: doc.endDate },
            endDate: { $gte: doc.startDate },
          },
        ],
      });

      if (overlappingCycle) {
        throw new Error('New cycle overlaps with an existing cycle');
      }

      return models.Cycle.findOneAndUpdate(
        { _id: doc._id },
        { $set: doc },
        { new: true },
      );
    }

    public static async endCycle(doc: ICycleDocument) {
      const endedCycle = await models.Cycle.findOneAndUpdate(
        { _id: doc._id },
        { $set: { isCompleted: true, isActive: false } },
        { new: true },
      );

      if (!endedCycle) {
        throw new Error('Cycle not found');
      }

      let nextCycle = await models.Cycle.findOneAndUpdate(
        {
          teamId: doc.teamId,
          isCompleted: false,
          startDate: { $gte: new Date() },
        },
        { $set: { isActive: true } },
        { sort: { startDate: 1 }, new: true },
      );

      if (!nextCycle) {
        const duration =
          endedCycle.endDate.getTime() - endedCycle.startDate.getTime();

        const newStartDate = new Date(endedCycle.endDate.getTime() + 1);
        const newEndDate = new Date(newStartDate.getTime() + duration);

        nextCycle = await models.Cycle.create({
          teamId: doc.teamId,
          startDate: newStartDate,
          endDate: newEndDate,
          isActive: true,
          isCompleted: false,
          name: `Cycle ${newStartDate.toDateString()}`,
        });
      }

      const unFinishedTasks = await models.Task.moveCycle(
        endedCycle._id,
        nextCycle?._id,
      );

      await models.Cycle.updateOne(
        { _id: endedCycle._id },
        { $set: { unFinishedTasks } },
      );

      return { endedCycle, nextCycle, unFinishedTasks };
    }
  }

  return cycleSchema.loadClass(Cycle);
};
