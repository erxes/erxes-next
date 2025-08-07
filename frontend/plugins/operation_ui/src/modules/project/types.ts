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

export enum ProjectPageTypes {
  All = 'all',
  Team = 'team',
}

export enum TaskPageTypes {
  All = 'all',
  Team = 'team',
  Project = 'project',
}

export enum ProjectHotKeyScope {
  ProjectsPage = 'projects-page',
  ProjectDetailPage = 'project-detail-page',
  ProjectAddSheet = 'project-add-sheet',
  ProjectEditSheet = 'project-edit-sheet',
  ProjectTableCell = 'project-table-cell',
}
