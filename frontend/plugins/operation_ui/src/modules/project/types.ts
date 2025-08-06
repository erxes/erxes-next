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
