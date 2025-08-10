import { addTaskSchema } from '@/task/types/validations';
import { z } from 'zod';

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
  status: number;
  targetDate: string;
  assigneeId: string;
  teamId: string;
  projectId: string;
  estimatedPoint: number;
  estimateChoices: IEstimateChoice[];
}

export type TAddTask = z.infer<typeof addTaskSchema>;
export * from '@/task/types/validations';
