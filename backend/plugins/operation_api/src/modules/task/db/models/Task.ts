import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { taskSchema } from '@/task/db/definitions/task';
import { ITask, ITaskDocument, ITaskFilter } from '@/task/@types/task';

export interface ITaskModel extends Model<ITaskDocument> {
  getTask(_id: string): Promise<ITaskDocument>;
  getTasks(params: ITaskFilter): Promise<ITaskDocument[]>;
  createTask(doc: ITask): Promise<ITaskDocument>;
  updateTask(_id: string, doc: ITask): Promise<ITaskDocument>;
  removeTask(TaskId: string): Promise<{ ok: number }>;
}

export const loadTaskClass = (models: IModels) => {
  class Task {
    public static async getTask(_id: string) {
      const Task = await models.Task.findOne({ _id }).lean();

      if (!Task) {
        throw new Error('Task not found');
      }

      return Task;
    }

    public static async getTasks(
      params: ITaskFilter,
    ): Promise<ITaskDocument[]> {
      const query = {} as any;

      if (params.assigneeId) {
        query.assigneeId = params.assigneeId;
      }

      if (params.name) {
        query.name = { $regex: params.name };
      }

      if (params.status) {
        query.status = params.status;
      }

      if (params.priority) {
        query.priority = params.priority;
      }

      if (params.labelIds) {
        query.labelIds = { $in: params.labelIds };
      }

      if (params.tagIds) {
        query.tagIds = { $in: params.tagIds };
      }

      if (params.cycleId) {
        query.cycleId = params.cycleId;
      }

      if (params.projectId) {
        query.projectId = params.projectId;
      }

      if (params.createdAt) {
        query.createdAt = { $gte: params.createdAt };
      }

      return models.Task.find(query).lean();
    }

    public static async createTask(doc: ITask): Promise<ITaskDocument> {
      return models.Task.insertOne(doc);
    }

    public static async updateTask(_id: string, doc: ITask) {
      return await models.Task.findOneAndUpdate({ _id }, { $set: { ...doc } });
    }

    public static async removeTask(TaskId: string[]) {
      return models.Task.deleteOne({ _id: { $in: TaskId } });
    }
  }

  taskSchema.loadClass(Task);

  return taskSchema;
};
