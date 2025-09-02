import {
  IconCircleDashed,
  IconCircle,
  IconCircleDot,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react';

export enum ProjectStatus {
  BACKLOG = 3,
  TODO = 2,
  IN_PROGRESS = 1,
  DONE = 4,
  CANCELLED = 5,
}

export const PROJECT_STATUS_OPTIONS = [
  {
    value: ProjectStatus.BACKLOG,
    name: 'Backlog',
    Icon: IconCircleDashed,
    IconColor: '#6B7280',
  },
  {
    value: ProjectStatus.TODO,
    name: 'Todo',
    Icon: IconCircle,
    IconColor: '#3B82F6',
  },
  {
    value: ProjectStatus.IN_PROGRESS,
    name: 'In Progress',
    Icon: IconCircleDot,
    IconColor: '#F59E0B',
  },
  {
    value: ProjectStatus.DONE,
    name: 'Done',
    Icon: IconCircleCheck,
    IconColor: '#10B981',
  },
  {
    value: ProjectStatus.CANCELLED,
    name: 'Cancelled',
    Icon: IconCircleX,
    IconColor: '#EF4444',
  },
];
