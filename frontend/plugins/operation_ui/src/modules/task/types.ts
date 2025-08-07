export interface ITask {
  _id: string;
  name: string;
  description: string;

  status: string;
  priority: number;
  assigneeId: string;
  createdBy: string;
  cycleId: string;
  labelIds: string[];
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
  projectId: string;
  teamId: string;
  estimatedPoint: number;
}
