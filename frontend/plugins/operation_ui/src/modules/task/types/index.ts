import { addTaskSchema } from '@/task/types/validations';
import { z } from 'zod';
import { TeamStatusTypes } from '@/team/types';

export interface IEstimateChoice {
  label: string;
  value: number;
}

export interface ITask {
  _id: string;
  name: string;
  tagIds: string[];
  createdAt: string;
  priority: number;
  status: string;
  targetDate: string;
  assigneeId: string;
  teamId: string;
  projectId: string;
  estimatePoint: number;
  estimateChoices: IEstimateChoice[];
}

export interface IStatus {
  value: string;
  label: string;
  color: string;
  type: TeamStatusTypes;
}

export type TAddTask = z.infer<typeof addTaskSchema>;
export * from '@/task/types/validations';
