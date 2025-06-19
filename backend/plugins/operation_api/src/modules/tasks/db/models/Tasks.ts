import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { tasksSchema } from '@/tasks/db/definitions/tasks';
import { ITasks, ITasksDocument } from '@/tasks/@types/tasks';

export interface ITasksModel extends Model<ITasksDocument> {
  getTasks(_id: string): Promise<ITasksDocument>;
  getTaskss(): Promise<ITasksDocument[]>;
  createTasks(doc: ITasks): Promise<ITasksDocument>;
  updateTasks(_id: string, doc: ITasks): Promise<ITasksDocument>;
  removeTasks(TasksId: string): Promise<{  ok: number }>;
}

export const loadTasksClass = (models: IModels) => {
  class Tasks {
    /**
     * Retrieves operation
     */
    public static async getTasks(_id: string) {
      const Tasks = await models.Tasks.findOne({ _id }).lean();

      if (!Tasks) {
        throw new Error('Tasks not found');
      }

      return Tasks;
    }

    /**
     * Retrieves all operations
     */
    public static async getTaskss(): Promise<ITasksDocument[]> {
      return models.Tasks.find().lean();
    }

    /**
     * Create a operation
     */
    public static async createTasks(doc: ITasks): Promise<ITasksDocument> {
      return models.Tasks.create(doc);
    }

    /*
     * Update operation
     */
    public static async updateTasks(_id: string, doc: ITasks) {
      return await models.Tasks.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove operation
     */
    public static async removeTasks(TasksId: string[]) {
      return models.Tasks.deleteOne({ _id: { $in: TasksId } });
    }
  }

  tasksSchema.loadClass(Tasks);

  return tasksSchema;
};
