import { addProjectSchema } from '@/project/types/validations';
import { z } from 'zod';

export interface IProject {
  _id: string;
  name: string;
  icon: string;
  tagIds: string[];
  createdAt: string;
  priority: number;
  status: number;
  targetDate: string;
  leadId: string;
  teamIds: string[];
}



export enum TaskPageTypes {
  All = 'all',
  Team = 'team',
  Project = 'project',
}

export type TAddProject = z.infer<typeof addProjectSchema>;
export * from '@/project/types/validations';
