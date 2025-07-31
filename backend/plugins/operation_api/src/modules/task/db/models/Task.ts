import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { taskSchema } from '@/task/db/definitions/task';
import { ITask, ITaskDocument } from '@/task/@types/task';

export interface ITaskModel extends Model<ITaskDocument> {
  getTask(_id: string): Promise<ITaskDocument>;
  getTasks(filter: any): Promise<ITaskDocument[]>;
  createTask(doc: ITask): Promise<ITaskDocument>;
  updateTask(_id: string, doc: ITask): Promise<ITaskDocument>;
  removeTask(TaskId: string): Promise<{ ok: number }>;
}

export const loadTaskClass = (models: IModels) => {
  class Task {
    /**
     * Retrieves operation
     */
    public static async getTask(_id: string) {
      const Task = await models.Task.findOne({ _id }).lean();

      if (!Task) {
        throw new Error('Task not found');
      }

      return Task;
    }

    /**
     * Retrieves all operations
     */
    public static async getTasks(filter: any): Promise<ITaskDocument[]> {
      return models.Task.find(filter).lean();
    }

    /**
     * Create a operation
     */
    public static async createTask(doc: ITask): Promise<ITaskDocument> {
      return models.Task.create(doc);
    }

    /*
     * Update operation
     */
    public static async updateTask(_id: string, doc: ITask) {
      return await models.Task.findOneAndUpdate({ _id }, { $set: { ...doc } });
    }

    /**
     * Remove operation
     */
    public static async removeTask(TaskId: string[]) {
      return models.Task.deleteOne({ _id: { $in: TaskId } });
    }
  }

  taskSchema.loadClass(Task);

  return taskSchema;
};
