import { ITask, ITaskDocument } from '@/tasks/@types/tasks';
import { tasksSchema } from '@/tasks/db/definitions/tasks';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {
  boardNumberGenerator,
  fillSearchTextItem,
} from '~/modules/tasks/db/models/utils';

export interface ITaskModel extends Model<ITaskDocument> {
  getTask(_id: string): Promise<ITaskDocument>;
  createTask(doc: ITask): Promise<ITaskDocument>;
  updateTask(_id: string, doc: ITask): Promise<ITaskDocument>;
  removeTask(_id: string): Promise<{ ok: number }>;
  updateTimeTracking(
    _id: string,
    status: string,
    timeSpent: number,
    startDate?: string,
  ): Promise<any>;
  watchTask(_id: string, isAdd: boolean, userId: string): void;
  removeTasks(_ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadTaskClass = (models: IModels) => {
  class Task {
    /**
     * Retreives Task
     */
    public static async getTask(_id: string) {
      const task = await models.Tasks.findOne({ _id });

      if (!task) {
        throw new Error('Task not found');
      }

      return task;
    }

    /**
     * Create a Task
     */
    public static async createTask(doc: ITask) {
      if (doc.sourceConversationIds) {
        const convertedTask = await models.Tasks.findOne({
          sourceConversationIds: { $in: doc.sourceConversationIds },
        });

        if (convertedTask) {
          throw new Error('Already converted a task');
        }
      }

      const stage = await models.Stages.getStage(doc.stageId);
      const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);

      if (pipeline.numberSize) {
        const { numberSize, numberConfig = '' } = pipeline;

        const number = await boardNumberGenerator(
          models,
          numberConfig,
          numberSize,
          false,
          pipeline.type,
        );

        doc.number = number;
      }

      const task = await models.Tasks.create({
        ...doc,
        createdAt: new Date(),
        modifiedAt: new Date(),
        stageChangedDate: new Date(),
        searchText: fillSearchTextItem(doc),
      });

      // update numberConfig of the same configed pipelines
      if (doc.number) {
        await models.Pipelines.updateMany(
          {
            numberConfig: pipeline.numberConfig,
            type: pipeline.type,
          },
          { $set: { lastNum: doc.number } },
        );
      }

      return task;
    }

    /**
     * Update Task
     */
    public static async updateTask(_id: string, doc: ITask) {
      const searchText = fillSearchTextItem(
        doc,
        await models.Tasks.getTask(_id),
      );

      return await models.Tasks.findOneAndUpdate(
        { _id },
        { $set: { ...doc, searchText } },
        { new: true },
      );
    }

    /**
     * Remove Tasks
     */
    public static async removeTasks(_ids: string[]) {
      // completely remove all related things
      await models.Checklists.removeChecklists(_ids);

      return await models.Tasks.deleteMany({ _id: { $in: _ids } });
    }

    /**
     * Watch task
     */
    public static async watchTask(_id: string, isAdd: boolean, userId: string) {
      const task = await models.Tasks.getTask(_id);

      const watchedUserIds = task.watchedUserIds || [];

      if (isAdd) {
        watchedUserIds.push(userId);
      } else {
        const index = watchedUserIds.indexOf(userId);

        watchedUserIds.splice(index, 1);
      }

      return await models.Tasks.findOneAndUpdate(
        { _id },
        { $set: { watchedUserIds } },
        { new: true },
      );
    }

    /**
     * Update time tracking
     */
    public static async updateTimeTracking(
      _id: string,
      status: string,
      timeSpent: number,
      startDate?: string,
    ) {
      const doc: { status: string; timeSpent: number; startDate?: string } = {
        status,
        timeSpent,
      };

      if (startDate) {
        doc.startDate = startDate;
      }

      return await models.Tasks.findOneAndUpdate(
        { _id },
        { $set: { timeTrack: doc } },
        { new: true },
      );
    }
  }

  tasksSchema.loadClass(Task);

  return tasksSchema;
};
