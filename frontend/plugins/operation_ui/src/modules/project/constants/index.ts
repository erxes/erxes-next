import {
  IconCircleDashed,
  IconCircle,
  IconCircleDot,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react';
export const PROJECTS_CURSOR_SESSION_KEY = 'projects_cursor_session_key';

export const PROJECT_PRIORITIES_OPTIONS = [
  {
    value: 0,
    name: 'No Priority',
  },
  { value: 1, name: 'Minor' },
  { value: 2, name: 'Medium' },
  { value: 3, name: 'High' },
  { value: 4, name: 'Critical' },
];

export const PROJECT_STATUS_OPTIONS = [
  {
    value: 0,
    name: 'Backlog',
    Icon: IconCircleDashed,
    IconColor: '#6B7280',
  },
  {
    value: 1,
    name: 'Todo',
    Icon: IconCircle,
    IconColor: '#3B82F6',
  },
  {
    value: 2,
    name: 'In Progress',
    Icon: IconCircleDot,
    IconColor: '#F59E0B',
  },
  {
    value: 3,
    name: 'Done',
    Icon: IconCircleCheck,
    IconColor: '#10B981',
  },
  {
    value: 4,
    name: 'Cancelled',
    Icon: IconCircleX,
    IconColor: '#EF4444',
  },
];

export * from './ProjectHotKeyScope';
