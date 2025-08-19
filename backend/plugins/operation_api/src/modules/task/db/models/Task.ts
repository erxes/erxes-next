import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { taskSchema } from '@/task/db/definitions/task';
import {
  ITask,
  ITaskDocument,
  ITaskFilter,
  ITaskUpdate,
} from '@/task/@types/task';
import { createTaskActivity } from '@/task/utils';

export interface ITaskModel extends Model<ITaskDocument> {
  getTask(_id: string): Promise<ITaskDocument>;
  getTasks(params: ITaskFilter): Promise<ITaskDocument[]>;
  createTask(doc: ITask): Promise<ITaskDocument>;
  updateTask({
    doc,
    userId,
  }: {
    doc: ITaskUpdate;
    userId: string;
  }): Promise<ITaskDocument>;
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
      const [result] = await models.Task.aggregate([
        { $match: { teamId: doc.teamId } },
        { $group: { _id: null, maxNumber: { $max: '$number' } } },
      ]);

      const nextNumber = (result?.maxNumber || 0) + 1;

      if (doc.projectId && doc.teamId) {
        const project = await models.Project.findOne({ _id: doc.projectId });

        if (project && !project.teamIds.includes(doc.teamId)) {
          throw new Error('Task project is not in this team');
        }
      }

      return models.Task.insertOne({
        ...doc,
        number: nextNumber,
      });
    }

    public static async updateTask({
      doc,
      userId,
    }: {
      doc: ITaskUpdate;
      userId: string;
    }) {
      const { _id, ...rest } = doc;

      const task = await models.Task.findOne({ _id });

      if (!task) {
        throw new Error('Task not found');
      }

      if (doc.status && doc.status !== task.status) {
        rest.statusChangedDate = new Date();
      }

      if (task.projectId && doc.teamId && doc.teamId !== task.teamId) {
        const project = await models.Project.findOne({ _id: task.projectId });

        if (project && !project.teamIds.includes(doc.teamId)) {
          throw new Error('Task project is not in this team');
        }
      }

      if (
        task.teamId &&
        doc.teamId &&
        task.teamId !== doc.teamId &&
        task.projectId
      ) {
        const project = await models.Project.findOne({ _id: task.projectId });

        if (project && !project.teamIds.includes(doc.teamId)) {
          throw new Error('Task project is not in this team');
        }
      }

      if (doc.teamId && doc.teamId !== task.teamId) {
        const [result] = await models.Task.aggregate([
          { $match: { teamId: doc.teamId } },
          { $group: { _id: null, maxNumber: { $max: '$number' } } },
        ]);

        const status = await models.Status.getStatus(task.status || '');

        const newStatus = await models.Status.findOne({
          teamId: doc.teamId,
          type: status.type,
        });

        await models.Activity.deleteMany({
          contentId: task._id,
          module: 'STATUS',
        });

        const nextNumber = (result?.maxNumber || 0) + 1;

        rest.number = nextNumber;
        rest.status = newStatus?._id;
      }

      await createTaskActivity({
        models,
        task,
        doc,
        userId,
      });

      return models.Task.findOneAndUpdate({ _id }, { $set: { ...rest } });
    }

    public static async removeTask(TaskId: string[]) {
      return models.Task.deleteOne({ _id: { $in: TaskId } });
    }
  }

  taskSchema.loadClass(Task);

  return taskSchema;
};
