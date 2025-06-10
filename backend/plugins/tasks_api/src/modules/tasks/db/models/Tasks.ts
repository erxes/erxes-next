import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { tasksSchema } from '@/tasks/db/definitions/tasks';
import { ITask } from '~/modules/tasks/@types/task';
import { ITasksDocument } from '~/modules/tasks/@types/taskDocument'


export interface ITasksModel extends Model<ITasksDocument> {
  getTasks(_id: string): Promise<ITasksDocument>;
  getTaskss(): Promise<ITasksDocument[]>;
  createTasks(doc: ITask): Promise<ITasksDocument>;
  updateTasks(_id: string, doc: ITask): Promise<ITasksDocument>;
  removeTasks(TasksId: string): Promise<{  ok: number }>;
}

export const loadTasksClass = (models: IModels) => {
  class Tasks {
    /**
     * Retrieves tasks
     */
    public static async getTasks(_id: string) {
      const Tasks = await models.Tasks.findOne({ _id }).lean();

      if (!Tasks) {
        throw new Error('Tasks not found');
      }

      return Tasks;
    }

    /**
     * Retrieves all taskss
     */
    public static async getTaskss(): Promise<ITasksDocument[]> {
      return models.Tasks.find().lean();
    }

    /**
     * Create a tasks
     */
    public static async createTasks(doc: ITask): Promise<ITasksDocument> {
      return models.Task.create(doc);
    }

    /*
     * Update tasks
     */
    public static async updateTasks(_id: string, doc: ITask) {
      return await models.Tasks.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    /**
     * Remove tasks
     */
    public static async removeTasks(TasksId: string[]) {
      return models.Tasks.deleteOne({ _id: { $in: TasksId } });
    }
  }

  tasksSchema.loadClass(Tasks);

  return tasksSchema;
};
