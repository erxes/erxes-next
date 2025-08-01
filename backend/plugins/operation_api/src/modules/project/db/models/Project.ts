import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { projectSchema } from '@/project/db/definitions/project';
import { IProject, IProjectDocument } from '@/project/@types/project';

export interface IProjectModel extends Model<IProjectDocument> {
  getProject(_id: string): Promise<IProjectDocument>;
  getProjects(filter: any): Promise<IProjectDocument[]>;
  createProject(doc: IProject): Promise<IProjectDocument>;
  updateProject(_id: string, doc: IProject): Promise<IProjectDocument>;
  removeProject(projectId: string): Promise<{ ok: number }>;
}

export const loadProjectClass = (models: IModels) => {
  class Project {
    public static async getProject(_id: string) {
      const Project = await models.Project.findOne({ _id }).lean();

      if (!Project) {
        throw new Error('Project not found');
      }

      return Project;
    }

    public static async getProjects(filter: any): Promise<IProjectDocument[]> {
      return models.Project.find(filter).lean();
    }

    public static async createProject(
      doc: IProject,
    ): Promise<IProjectDocument> {
      return models.Project.insertOne(doc);
    }

    public static async updateProject(_id: string, doc: IProject) {
      return await models.Project.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }

    public static async removeProject(projectId: string[]) {
      const task = await models.Task.findOne({ projectId: { $in: projectId } });

      if (task) {
        throw new Error('Project has tasks');
      }

      return models.Project.deleteOne({ _id: { $in: projectId } });
    }
  }

  return projectSchema.loadClass(Project);
};
